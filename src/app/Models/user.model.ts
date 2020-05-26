import { Timestamp } from 'rxjs';
import { Time } from '@angular/common';

export class User {
    userId: number;
    fullname: string;
    userEmail: string;
    userMobile: string;
    dateOfBirth: Date;
    userPassword: string;
    mobVerifficationCode: string;
    emailVerifficationCode: string;
    isMobileVerrified: boolean;
    isEmailVerrified: boolean;

    profileCreationTime: Time;
    profileUpdationTime: Time;
    instituteName: string;
    profilePicPath: string;
    userDocumentPath: string;
    docUploadTime: Time;
    isDocUploaded: boolean;
    grade: number;
    professionId: number;
    specializationId: number;
    detailsSpecializationId: number;
    profilePicId: string;
    documentId: string;
    recordStatus: boolean;
}