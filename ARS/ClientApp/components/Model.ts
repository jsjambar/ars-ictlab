export type User = {
    userId:number|null,
    Username:string,
    firstName:string,
    lastName:string,
    password:string,
    roleId:number,
}

export type Role = {
    RoleId:number|null,
    Name:string
}

export type Classroom = {
    ClassroomId:number|null,
    Name:string,
    Description:string,
    StartTime:Date,
    EndTime:Date,
    IsDisabled:boolean,
    LocationId:number,
}

export type Location = {
    LocationId:number|null,
    Name:string,
    Description:string
}

export type Reservation = {
    reservationId:number|null,
    date:Date,
    startTime:Date,
    endTime:Date,
    userId:number,
    user:User,
    classroomId:number,
}

export type Problem = {
    ProblemId:number|null,
    Name:string
}