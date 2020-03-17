import { User } from './../models/user';
import { TestBed } from '@angular/core/testing';
// Http testing module and mocking controller
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { RegistrationService } from './registration.service';
import { HttpErrorResponse } from '@angular/common/http';

describe('RegistrationService', () => {
  let registrationService: RegistrationService;
  let httpMock: HttpTestingController;
  const apiURL = 'https://demo-api.now.sh/users';
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    registrationService = TestBed.inject(RegistrationService);
    httpMock = TestBed.get(HttpTestingController);

  });

  it('should be created', () => {
    expect(registrationService).toBeTruthy();
  });

  it('returned Observable should match the right data', () => {
    const user: User = {
      firstName: 'fn',
      lastName: 'ln',
      email: 'em@i.l'
    };
    registrationService.register(user)
      .subscribe((courseData: User) => {
        expect(courseData.firstName).toEqual('fn');
      });

    const req = httpMock.expectOne(apiURL);

    expect(req.request.method).toEqual('POST');

    req.flush(user);
  });

  it('can test for 404 error', () => {
    const emsg = 'deliberate 404 error';
    const user: User = {
      firstName: 'fn',
      lastName: 'ln',
      email: 'em@i.l'
    };
    registrationService.register(user).subscribe(
      data => fail('should have failed with the 404 error'),
      (error: HttpErrorResponse) => {
        expect(error.status).toEqual(404, 'status');
        expect(error.error).toEqual(emsg, 'message');
      }
    );

    const req = httpMock.expectOne(apiURL);

    // Respond with mock error
    req.flush(emsg, { status: 404, statusText: 'Not Found' });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
