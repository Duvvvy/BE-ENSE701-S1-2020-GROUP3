class signUpChecker{
    constructor(body)
    {
        this.username = body.username;
        this.affiliation = body.affiliation
        this.password = body.password;
        this.fullname = body.fullname;
        this.email = body.email;
        this.gender = body.gender;
        this.age = body.age;
    }
}