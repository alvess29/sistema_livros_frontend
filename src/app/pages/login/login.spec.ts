import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { vi } from 'vitest';
import { Login } from './login';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let router: Router;

  beforeEach(async () => {
    sessionStorage.clear();

    await TestBed.configureTestingModule({
      imports: [Login],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    await fixture.whenStable();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should store the user name and go to home', () => {
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    component.userName = '  Ana  ';

    component.onAccess();

    expect(sessionStorage.getItem('user')).toBe('Ana');
    expect(navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should not access without a name', () => {
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    component.userName = '   ';

    component.onAccess();

    expect(sessionStorage.getItem('user')).toBeNull();
    expect(navigate).not.toHaveBeenCalled();
  });
});
