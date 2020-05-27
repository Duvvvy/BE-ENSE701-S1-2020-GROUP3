class signUpChecker{
    constructor(headers)
    {
        this.username = headers.username;
        this.affiliation = headers.affiliation
        this.password = headers.password;
        this.fullname = headers.fullname;
        this.email = headers.email;
        this.gender = headers.gender;
        this.age = headers.age;
    }
    
    test()
    {
        console.log(this.username);
    }
}