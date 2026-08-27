import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DevRoleSwitcher } from './DevRoleSwitcher';
import { BrowserRouter } from 'react-router-dom';

const mockedUseNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const mod = await vi.importActual('react-router-dom');
  return {
    ...mod,
    useNavigate: () => mockedUseNavigate,
    useLocation: () => ({ pathname: '/' }),
  };
});

describe('DevRoleSwitcher component', () => {
  it('renders correctly', () => {
    render(
      <BrowserRouter>
        <DevRoleSwitcher />
      </BrowserRouter>
    );
    expect(screen.getByText('پنل توسعه‌دهنده (مسیرها)')).toBeInTheDocument();
  });

  it('navigates to home when clicking صفحه اصلی', () => {
    render(
      <BrowserRouter>
        <DevRoleSwitcher />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText('صفحه اصلی'));
    expect(mockedUseNavigate).toHaveBeenCalledWith('/');
  });

  it('navigates to patient portal', () => {
    render(
      <BrowserRouter>
        <DevRoleSwitcher />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText('پورتال بیمار'));
    expect(mockedUseNavigate).toHaveBeenCalledWith('/dashboard/patient');
  });
});
