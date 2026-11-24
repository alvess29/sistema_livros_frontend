import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Button } from './button';

describe('Button', () => {
  let component: Button;
  let fixture: ComponentFixture<Button>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Button],
    }).compileComponents();

    fixture = TestBed.createComponent(Button);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the button text', async () => {
    component.textButton = 'Acessar';
    fixture.changeDetectorRef.markForCheck();
    await fixture.whenStable();

    const botao = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(botao.textContent?.trim()).toBe('Acessar');
  });
});
