export type User = {
<<<<<<< HEAD
    userId:number|null,
    Username:string,
    firstName:string,
    lastName:string,
=======
    userid:number|0,
    username:string,
    firstname:string,
    lastname:string,
>>>>>>> origin/New_Reservation_System
    password:string,
    roleId:number,
}

export type Role = {
    roleid:number|null,
    name:string
}

export type Classroom = {
    classroomid:number|null,
    name:string,
    description:string,
    starttime:Date,
    endtime:Date,
    isdisabled:boolean,
    locationid:number,
}

export type Location = {
    locationid:number|null,
    name:string,
    description:string
}

export type Reservation = {
    reservationid:number|null,
    date:Date,
    starttime:Date,
    endtime:Date,
    userid:number,
    user:User,
    classroomid:number,
}

export type Problem = {
    problemid:number|null,
    name:string
}