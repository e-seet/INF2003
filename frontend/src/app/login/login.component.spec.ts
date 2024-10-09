import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have email and password fields', () => {
    expect(component.email).toBeDefined();
    expect(component.password).toBeDefined();
  });

  it('should show error if email or password is missing', () => {
    component.email = '';
    component.password = '';
    component.login();
    expect(component.errorMessage).toBe('Please enter both email and password.');
  });

  it('should navigate to home on successful login', () => {
    spyOn(component['router'], 'navigate');
    component.email = 'test@example.com';
    component.password = 'password123';
    component.login();
    expect(component['router'].navigate).toHaveBeenCalledWith(['/home']);
  });
});
