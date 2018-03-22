export type User = {
    userid:number|0,
    username:string,
    firstname:string,
    lastname:string,
    password:string,
    roleId:number,
}

export type Role = {
    roleid:number|null,
    name:string
}

export type Classroom = {
    classroomId:number|null,
    name:string,
    startTime:Date,
    endTime:Date,
    isPublic:boolean,
    isDisabled:boolean
    locationId:number,
}

export type Location = {
    locationId:number|null,
    name:string
}

export type Reservation = {
    reservationid:number|null,
    date:Date,
    starttime:Date,
    endtime:Date,
    userid:number,
    user:User,
    classroomid:number
}

export type Problem = {
    problemid:number|null,
    name:string
}