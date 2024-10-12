import { TestBed } from '@angular/core/testing';

import { S3serviceService } from './s3service.service';

describe('S3serviceService', () => {
  let service: S3serviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(S3serviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
