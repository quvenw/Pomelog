import { TestBed } from '@angular/core/testing';

import { PomelogService } from './pomelog.service';

describe('PomelogService', () => {
  let service: PomelogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PomelogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
