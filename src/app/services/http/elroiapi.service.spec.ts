import { TestBed } from '@angular/core/testing';

import { ElroiapiService } from './elroiapi.service';

describe('ElroiapiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ElroiapiService = TestBed.get(ElroiapiService);
    expect(service).toBeTruthy();
  });
});
