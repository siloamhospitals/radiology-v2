export const successLoginResponse = {
    status: 'OK',
    data: [
        {
            hospital_id: '39764039-37b9-4176-a025-ef7b2e124ba4',
            hospital_hope_id: 2,
            name: 'Siloam Hospitals Lippo Village',
            alias: 'SHLV',
            time_zone: 7,
            is_bpjs: true,
            is_bridging: true,
            is_next_update: true,
            role_id: '263ebf52-9ea9-4e92-a4e9-f4a0a3366de8',
            role_name: 'Front Office',
            user_id: 'e597ca38-c4ee-4449-9f1c-9d64e907c8cb',
            user_name: 'albert.aswindra',
            full_name: 'Albert Agung Daru Aswindra',
            birthday: '1900-01-01T00:00:00',
            handphone: '081319027752',
            user_role_id: 10395
        },
        {
            hospital_id: '253c529a-d4aa-477d-81f9-27fee6b04d5c',
            hospital_hope_id: 9,
            name: 'Siloam Hospitals Makassar',
            alias: 'SHMK',
            time_zone: 8,
            is_bpjs: false,
            is_bridging: false,
            is_next_update: null,
            role_id: '263ebf52-9ea9-4e92-a4e9-f4a0a3366de8',
            role_name: 'Front Office',
            user_id: 'e597ca38-c4ee-4449-9f1c-9d64e907c8cb',
            user_name: 'albert.aswindra',
            full_name: 'Albert Agung Daru Aswindra',
            birthday: '1900-01-01T00:00:00',
            handphone: '081319027752',
            user_role_id: 10449
        }
    ],
    message: 'Successfuly Login'
};

export const failedLoginResponse = {
    status: 'ERROR',
    data: null,
    message: 'Username or password is incorrect!'
};
