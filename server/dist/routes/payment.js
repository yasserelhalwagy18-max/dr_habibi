import express, {} from 'express';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
const prisma = new PrismaClient();
const router = express.Router();
const PRICES = {
    ASSESSMENT: 150000,
    PACKAGE_12: 1200000,
    PACKAGE_24: 2200000
};
router.post('/checkout', async (req, res) => {
    try {
        const { userId, itemType, discountCode, assessmentFormId } = req.body;
        if (!['ASSESSMENT', 'PACKAGE_12', 'PACKAGE_24'].includes(itemType)) {
            res.status(400).json({ success: false, error: 'Invalid item type' });
            return;
        }
        let baseAmount = 0;
        let transactionType = 'PACKAGE';
        if (itemType === 'ASSESSMENT') {
            baseAmount = PRICES.ASSESSMENT;
            transactionType = 'ASSESSMENT';
        }
        else if (itemType === 'PACKAGE_12') {
            baseAmount = PRICES.PACKAGE_12;
        }
        else if (itemType === 'PACKAGE_24') {
            baseAmount = PRICES.PACKAGE_24;
        }
        let finalAmount = baseAmount;
        let discountCodeId = null;
        if (discountCode) {
            const discount = await prisma.discountCode.findUnique({
                where: { code: discountCode }
            });
            if (!discount || !discount.isActive) {
                res.status(400).json({ success: false, error: 'Invalid or inactive discount code' });
                return;
            }
            if (discount.expirationDate && new Date() > discount.expirationDate) {
                res.status(400).json({ success: false, error: 'Discount code has expired' });
                return;
            }
            if (discount.maxUses && discount.usedCount >= discount.maxUses) {
                res.status(400).json({ success: false, error: 'Discount code usage limit reached' });
                return;
            }
            if (discount.type === 'PERCENTAGE') {
                finalAmount = baseAmount - (baseAmount * (discount.value / 100));
            }
            else if (discount.type === 'FIXED') {
                finalAmount = Math.max(0, baseAmount - discount.value);
            }
            discountCodeId = discount.id;
        }
        // Generate mock Zarinpal Authority
        const authority = `A${uuidv4().replace(/-/g, '').substring(0, 35)}`;
        const transaction = await prisma.transaction.create({
            data: {
                userId: userId || null,
                assessmentFormId: assessmentFormId || null,
                amount: finalAmount,
                baseAmount,
                type: transactionType,
                status: 'PENDING',
                zarinpalAuthority: authority,
                discountCodeId
            }
        });
        // In a real integration, we would send a request to Zarinpal to get the payment URL
        // Here we redirect to our mock gateway
        const paymentUrl = `http://localhost:5000/api/payment/mock-gateway?authority=${authority}`;
        res.json({ success: true, paymentUrl });
    }
    catch (error) {
        console.error('Checkout error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});
router.get('/mock-gateway', async (req, res) => {
    const { authority } = req.query;
    if (!authority) {
        res.redirect('http://localhost:5173/payment/failure?status=CANCELLED');
        return;
    }
    // Simulate user making a successful payment
    // In reality Zarinpal redirects to frontend/callback with Authority and Status
    res.redirect(`http://localhost:5173/payment/success?status=OK&trackId=${authority}`);
});
router.post('/verify', async (req, res) => {
    try {
        const { authority, status } = req.body;
        if (!authority || status !== 'OK') {
            res.status(400).json({ success: false, error: 'Invalid payment status' });
            return;
        }
        const transaction = await prisma.transaction.findFirst({
            where: { zarinpalAuthority: authority }
        });
        if (!transaction) {
            res.status(404).json({ success: false, error: 'Transaction not found' });
            return;
        }
        if (transaction.status === 'SUCCESS') {
            res.json({ success: true, message: 'Transaction already verified' });
            return;
        }
        const refId = uuidv4(); // Mock Zarinpal RefID
        await prisma.$transaction(async (tx) => {
            await tx.transaction.update({
                where: { id: transaction.id },
                data: {
                    status: 'SUCCESS',
                    zarinpalRefId: refId
                }
            });
            if (transaction.discountCodeId) {
                await tx.discountCode.update({
                    where: { id: transaction.discountCodeId },
                    data: { usedCount: { increment: 1 } }
                });
            }
            if (transaction.type === 'ASSESSMENT' && transaction.assessmentFormId) {
                await tx.assessmentForm.update({
                    where: { id: transaction.assessmentFormId },
                    data: { assessmentPaid: true }
                });
            }
            else if (transaction.type === 'PACKAGE' && transaction.userId) {
                // Find User's PatientProfile
                const patientProfile = await tx.patientProfile.findUnique({
                    where: { userId: transaction.userId }
                });
                if (patientProfile) {
                    // Identify package based on amount (simplified for mock)
                    // A better approach would be to store packageId in transaction during checkout
                    let packageObj;
                    if (transaction.baseAmount === PRICES.PACKAGE_12) {
                        packageObj = await tx.package.findFirst({ where: { numberOfSessions: 12 } });
                        if (!packageObj) {
                            packageObj = await tx.package.create({ data: { name: '12-Session Package', price: 1200000, numberOfSessions: 12 } });
                        }
                    }
                    else if (transaction.baseAmount === PRICES.PACKAGE_24) {
                        packageObj = await tx.package.findFirst({ where: { numberOfSessions: 24 } });
                        if (!packageObj) {
                            packageObj = await tx.package.create({ data: { name: '24-Session Package', price: 2200000, numberOfSessions: 24 } });
                        }
                    }
                    if (packageObj) {
                        const startDate = new Date();
                        const endDate = new Date();
                        endDate.setMonth(endDate.getMonth() + 1);
                        await tx.patientPackage.create({
                            data: {
                                patientProfileId: patientProfile.id,
                                packageId: packageObj.id,
                                status: 'ACTIVE',
                                remainingSessions: packageObj.numberOfSessions,
                                startDate,
                                endDate
                            }
                        });
                    }
                }
            }
        });
        res.json({ success: true, data: { refId } });
    }
    catch (error) {
        console.error('Verify error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});
export default router;
//# sourceMappingURL=payment.js.map