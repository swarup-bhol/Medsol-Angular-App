import { TestBed } from '@angular/core/testing';

import { SharedVarService } from './shared-var.service';

describe('SharedVarService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SharedVarService = TestBed.get(SharedVarService);
    expect(service).toBeTruthy();
  });
});
