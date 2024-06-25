import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import LoginForm from './Components/Common/LoginForm';
import RegisterForm from './Components/Common/RegisterForm';
import HomeDoctor from './Components/HomeDoctor';
import HomePatient from './Components/HomePatient';
import HomeAdmin from './Components/HomeAdmin';
import Home from './Components/Home';
import ResetForm from './Components/ResetForm';

jest.mock('./firebase-config', () => ({
  database: jest.fn()
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn()
}));

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn()
  },
  ToastContainer: () => <div />
}));

describe('Компонент App', () => {
  test('відображає компонент LoginForm для маршруту /login', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
        </Routes>
      </MemoryRouter>
    );

    const signInElements = screen.getAllByText(/sign in/i);
    expect(signInElements).toHaveLength(2);
  });

  test('відображає компонент RegisterForm для маршруту /register', () => {
    render(
      <MemoryRouter initialEntries={['/register']}>
        <Routes>
          <Route path="/register" element={<RegisterForm />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/register/i)).toBeInTheDocument();
  });

  test('переходить на HomeDoctor після успішного входу для лікаря', async () => {
    const mockSignInWithEmailAndPassword = require('firebase/auth').signInWithEmailAndPassword;
    mockSignInWithEmailAndPassword.mockResolvedValue({
      user: { uid: 'doctorUid' },
      _tokenResponse: { refreshToken: 'doctorToken' }
    });

    render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'doctor@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password' } });
    
    const signInButton = screen.getAllByText(/sign in/i).find((el) => el.tagName === 'BUTTON');
    fireEvent.click(signInButton);

    expect(mockSignInWithEmailAndPassword).toHaveBeenCalled();
  });

  test('відображає компонент Home для маршруту /', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/one-stop solution for your eyes/i)).toBeInTheDocument();
  });

  test('відображає компонент ResetForm для маршруту /reset-password', () => {
    render(
      <MemoryRouter initialEntries={['/reset-password']}>
        <Routes>
          <Route path="/reset-password" element={<ResetForm />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/reset password/i)).toBeInTheDocument();
  });

  test('переходить на HomeAdmin після успішного входу для адміністратора', async () => {
    const mockSignInWithEmailAndPassword = require('firebase/auth').signInWithEmailAndPassword;
    mockSignInWithEmailAndPassword.mockResolvedValue({
      user: { uid: 'adminUid' },
      _tokenResponse: { refreshToken: 'adminToken' }
    });

    render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'admin@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password' } });
    
    const signInButton = screen.getAllByText(/sign in/i).find((el) => el.tagName === 'BUTTON');
    fireEvent.click(signInButton);

    expect(mockSignInWithEmailAndPassword).toHaveBeenCalled();
  });

  test('переходить на HomePatient після успішного входу для пацієнта', async () => {
    const mockSignInWithEmailAndPassword = require('firebase/auth').signInWithEmailAndPassword;
    mockSignInWithEmailAndPassword.mockResolvedValue({
      user: { uid: 'patientUid' },
      _tokenResponse: { refreshToken: 'patientToken' }
    });

    render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'patient@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password' } });
    
    const signInButton = screen.getAllByText(/sign in/i).find((el) => el.tagName === 'BUTTON');
    fireEvent.click(signInButton);

    expect(mockSignInWithEmailAndPassword).toHaveBeenCalled();
  });
});
