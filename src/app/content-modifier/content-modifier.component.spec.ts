import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentModifierComponent } from './content-modifier.component';

describe('ContentModifierComponent', () => {
  let component: ContentModifierComponent;
  let fixture: ComponentFixture<ContentModifierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentModifierComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentModifierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
