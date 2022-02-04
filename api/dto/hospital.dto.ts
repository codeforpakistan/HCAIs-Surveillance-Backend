export interface HospitalDto {
    id: string;
    name: string;
    contact: string;
    address: string;
    departments: [{
        name: string,
        units: [{
            name: string,
        }]
    }];
}