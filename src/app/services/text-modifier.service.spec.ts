import { TestBed } from '@angular/core/testing';

import { TextModifierService } from './text-modifier.service';

describe('TextModifierService', () => {
  let service: TextModifierService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TextModifierService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
