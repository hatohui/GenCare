## 1\. 🟨 Deactivate Account

|                 | For: Member                                                                            |     |             | Completed |                   |     |
| :-------------- | -------------------------------------------------------------------------------------- | --- | :---------- | :-------: | :---------------: | --- |
| **Description** |                                                                                        |     |             |           |                   |     |
| **URL**         | **/api/accounts/{id}**                                                                 |     |             |           |                   |     |
| **Header**      | AccessToken                                                                            |     | **Method**  |           |      DELETE       |     |
| **Frontend**    | Lê Sỹ Tuyền                                                                            |     | **Backend** |           | Hồng Lê Đăng Khoa |     |
| **Request**     | { id: string }                                                                         |     |             |           |                   |     |
| **Response**    | { id: string; email: string; deletedAt: Date; deletedBy: string; isDeleted: boolean; } |     |             |           |                   |     |

##

## 2\. View my account detail

| View Account Details | For: Member                    |     |             | Completed |               |     |
| :------------------- | ------------------------------ | --- | :---------- | :-------: | :-----------: | --- |
| **Description**      |                                |     |             |           |               |     |
| **URL**              | **/api/accounts/me**           |     |             |           |               |     |
| **Header**           | AccessToken                    |     | **Method**  |           |      GET      |     |
| **Frontend**         | Lê Sỹ Tuyền                    |     | **Backend** |           | Phạm Anh Kiệt |     |
| **Request**          |                                |     |             |           |               |     |
| **Response**         | { account: AccountViewModel; } |     |             |           |               |     |

##

## 3\. update account

| Change Account Details | For: All                                                                                                                                                                                                                                                   |     |             | Not Started |                  |     |
| :--------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- | :---------- | :---------: | :--------------: | --- |
| **Description**        | Allow users to change account detail                                                                                                                                                                                                                       |     |             |             |                  |     |
| **URL**                | **/api/accounts/{id}**                                                                                                                                                                                                                                     |     |             |             |                  |     |
| **Header**             | AccessToken                                                                                                                                                                                                                                                |     | **Method**  |             |       PUT        |     |
| **Frontend**           | Lê Sỹ Tuyền                                                                                                                                                                                                                                                |     | **Backend** |             | Nguyễn Tiến Phát |     |
| **Request**            | { account { firstName?: string, lastName?: string, phoneNumber?: string, gender?: boolean, dateOfBirth?: date, avatarUrl?: string, isDeleted?: bool } staffInfo?: { departmentId?: string, degree?: string, yearOfExperience?: int, biography?: string } } |     |             |             |                  |     |
| **Response**           | 200 if successful, 400 if failed                                                                                                                                                                                                                           |     |             |             |                  |     |

##

## 4\. ✅ Get all accounts

| Get Accounts    | For: Consultant                                                                                                                                                                                            |                   |                         | In Progress |               |     |
| :-------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | :---------------------- | :---------: | :-----------: | --- | --- | --- | --- |
| **Description** | Allow users to change account detail                                                                                                                                                                       |                   |                         |             |               |     |
| **URL**         | \*\*/api/accounts?page={num}\&count={num}\&search={str                                                                                                                                                     | null} \&role={str | null} \&active={boolean |  null}\*\*  |               |     |     |     |     |
| **Header**      | AC \+ RF                                                                                                                                                                                                   |                   | **Method**              |             |      GET      |     |
| **Frontend**    | Lê Sỹ Tuyền                                                                                                                                                                                                |                   | **Backend**             |             | Phạm Anh Kiệt |     |
| **Request**     |                                                                                                                                                                                                            |                   |                         |             |               |     |
| **Response**    | { totalCount: number, accounts: \[{ id: string; role: string; email: string; firstName: string; lastName: string; gender: boolean; dateOfBirth: string; avatarUrl?: string; isDeleted: boolean; },...\]; } |                   |                         |             |               |     |

##

## 5\. View account detail by id (đang làm chưa xong)

| View Account Details | For: Admin                     |     |             | Completed |               |     |
| :------------------- | ------------------------------ | --- | :---------- | :-------: | :-----------: | --- |
| **Description**      |                                |     |             |           |               |     |
| **URL**              | **/api/accounts/{id}**         |     |             |           |               |     |
| **Header**           | AccessToken                    |     | **Method**  |           |      GET      |     |
| **Frontend**         | Lê Sỹ Tuyền                    |     | **Backend** |           | Phạm Anh Kiệt |     |
| **Request**          |                                |     |             |           |               |     |
| **Response**         | { account: AccountViewModel; } |     |             |           |               |     |

##

## 6\. Create staff account

| View Account Details | For: Admin                                                                                                                                                                                                                                                                       |     |             | Completed |                  |     |
| :------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- | :---------- | :-------: | :--------------: | --- |
| **Description**      |                                                                                                                                                                                                                                                                                  |     |             |           |                  |     |
| **URL**              | **/api/accounts**                                                                                                                                                                                                                                                                |     |             |           |                  |     |
| **Header**           | AccessToken                                                                                                                                                                                                                                                                      |     | **Method**  |           |       POST       |     |
| **Frontend**         | Lê Sỹ Tuyền                                                                                                                                                                                                                                                                      |     | **Backend** |           | Nguyễn Tiến Phát |     |
| **Request**          | { staffAccount { email: string, roleId: string, firstName: string, lastName: string, avatarUrl: string, gender: bool, phoneNumber: string, dateOfBirth: Date, password: string } staffInfo { degree: string, yearOfExperience: int, biography?: string, departmentId: string } } |     |             |           |                  |     |
| **Response**         | { id: string, role: string, email: string, firstName: string, lastName: string, gender: bool, phoneNumber: string, dateOfBirth: Date, avatarUrl?: string, degree: string, yearOfExperience: int, biography?: string, departmentName: string }                                    |     |             |           |                  |     |
|                      |                                                                                                                                                                                                                                                                                  |     |             |           |                  |     |

##

## 6\. Get all consultant information

| View Account Details | For: None                                                                                                                                                                                                                                                         |     |             | Completed |                  |     |
| :------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- | :---------- | :-------: | :--------------: | --- |
| **Description**      |                                                                                                                                                                                                                                                                   |     |             |           |                  |     |
| **URL**              | **/api/accounts/consultants**                                                                                                                                                                                                                                     |     |             |           |                  |     |
| **Header**           | Not required                                                                                                                                                                                                                                                      |     | **Method**  |           |       GET        |     |
| **Frontend**         | Lê Sỹ Tuyền                                                                                                                                                                                                                                                       |     | **Backend** |           | Nguyễn Tiến Phát |     |
| **Request**          |                                                                                                                                                                                                                                                                   |     |             |           |                  |     |
| **Response**         | consultants: \[ { id: string, role: string, email: string, firstName?: string, lastName?: string, gender: bool, phoneNumber?: string, dateOfBirth?: Date, avatarUrl?: string, degree: string, yearOfExperience: int, biography?: string, department: string }, \] |     |             |           |                  |     |
|                      |                                                                                                                                                                                                                                                                   |     |             |           |                  |     |

##
