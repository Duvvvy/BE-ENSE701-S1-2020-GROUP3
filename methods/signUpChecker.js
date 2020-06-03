module.exports = class signUpChecker{
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

    checker(){
        //TODO add database unique check
        console.log("warning, signUpChecker needs DB check")
        let usernameRegex = /^[A-Za-z]\w{7,50}$/;
        let usernameValid = usernameRegex.test(this.username);

        var passwordRegex = /^[A-Za-z]\w{7,14}$/;
        let passwordValid = passwordRegex.test(this.password);

        var affiliationRegex = /^[A-Za-z]\w{2,100}$/;
        let affiliationValid = affiliationRegex.test(this.affiliation);

        var fullnameRegex = /^[a-zA-Z]+(\s[a-zA-Z]*)\w{3,255}$/;
        let fullnameValid = fullnameRegex.test(this.fullname);

        var emailRegex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
        let emailValid = emailRegex.test(this.email);
        
        var genderRegex = /^[A-Z]$/;
        let genderValid = genderRegex.test(this.gender);

        var ageRegex = /^[0-9]\w{1,1}$/;
        let ageValid = ageRegex.test(this.age);

        var array = [];
        array.push("username", usernameValid);
        array.push("password", passwordValid);
        array.push("affiliation", affiliationValid);
        array.push("fullname",fullnameValid);
        array.push("email",emailValid);
        array.push("gender", genderValid);
        array.push("age",ageValid);
        return(array);
    }
}