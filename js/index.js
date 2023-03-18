let displayedData = document.getElementById('displayedData')
let searchDiv = document.getElementById('searchDiv')

$(function () {

    // LOADER
    $(".lds-ripple").fadeOut(500, function () {
        $("#loader").fadeOut(500, function () {
            $("body").css("overflow","auto")
            $("#loader").remove()
        })
    })
});

    // SIDE NAVBAR
    let iconChange = document.querySelector(".nav-icon-change")
    closeNav()
    
    function openNav() {
        $(".sidenav").animate({ left: 0 }, 500)
        
        iconChange.classList.add("close", "bi", "bi-x")
        iconChange.classList.remove("menu" , "bi", "bi-justify")
        
        let navLinks = document.querySelectorAll('.nav-links li')
        for (let i = 0; i < navLinks.length; i++) {
            navLinks[i].classList.add("animate__animated", "animate__bounceInUp")
        }
    }
    
    function closeNav() {
        let navDataWidth = $(".sidenav .nav-data").outerWidth()
        $(".sidenav").animate({ left: -navDataWidth }, 500)
        
        iconChange.classList.add("menu" , "bi", "bi-justify")
        iconChange.classList.remove("close", "bi", "bi-x")        
    }

    $(".sidenav i.nav-icon-change").click(() => {
        if ($(".sidenav").css("left") == "0px") {
            closeNav()
        } else {
            openNav()
        }
    })


    function displayMeals(arrItems) {
        let blackBox = ``
        for (let i = 0; i < arrItems.length; i++) {
            blackBox += `
            <div class="col-md-3">
                <div class="meal position-relative overflow-hidden cursor-pointer" onclick="getMealDetails('${arrItems[i].idMeal}')">
                <img src="${arrItems[i].strMealThumb}" alt="${arrItems[i].strMeal}" class="w-100 rounded-2">
                <div class="meal-layer position-absolute rounded-2 d-flex align-items-center justify-content-center">
                    <h3 class="text-black text-capitalize">${arrItems[i].strMeal}</h3>
                </div>
                </div>
            </div>
            `            
        }
        displayedData.innerHTML = blackBox
    }

    async function getMealDetails(id) {
        closeNav()
        searchDiv.innerHTML = ""
        displayedData.innerHTML = ""
        
        $("#inner-loader").css("height", "100vh");
        $("#home-page .lds-ripple").fadeIn(300)   

        let api = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
        let response = await api.json()

        displayMealDetails(response.meals[0])

        $("#home-page .lds-ripple").fadeOut(300, function () {  
            $("#inner-loader").css("height", "0");
        })
    }

    function displayMealDetails(meal) {
        searchDiv.innerHTML = ""
        let ingredients = ``
        for (let i = 1; i <= 20; i++) {
            if (meal[`strIngredient${i}`]) {
                ingredients += `<li class="badge bg-secondary m-2 p-2">${meal[`strMeasure${i}`]}&nbsp;${meal[`strIngredient${i}`]}</li>`
            }
        }

        let tags = meal.strTags?.split(",")
        if (!tags) tags = []
        
        let tagsStr = ''
        for (let i = 0; i < tags.length; i++) {
            tagsStr += `
                <li class="badge bg-secondary m-2 p-2">${tags[i]}</li>`
        }

        blackBox = `
        <div class="col-md-4 text-capitalize details">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="w-100 rounded-2">
            <h3 class="text-center mt-2">${meal.strMeal}</h3>
        </div>
        <div class="col-md-8 text-capitalize details-text">
            <h2>instructions</h2>
            <p>${meal.strInstructions}</p>

            <h3>area : <span>${meal.strArea}</span></h3>
            <h3>category : <span>${meal.strCategory}</span></h3>

            <h3>reciepe : </h3>
            <ul class="list-unstyled">
                ${ingredients}
            </ul>

            <h3>tags : </h3>
            <ul class="list-unstyled">
                ${tagsStr}
            </ul>
    
            <a href="${meal.strSource}" class="btn btn-outline-warning text-capitalize me-2" target="_blank">source</a>
            <a href="${meal.strYoutube}" class="btn btn-outline-danger text-capitalize" target="_blank">youtube</a>
        </div>
        `
        displayedData.innerHTML = blackBox
    }

    // RANDOM
    randomMeals()
    async function randomMeals() {
        closeNav()
        searchDiv.innerHTML = ""
        
        $("#home-page .lds-ripple").fadeIn(1000, function () {
            $("#inner-loader").css("height", "0");
        })   

        let api= await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=`)
        let response = await api.json()

        displayMeals(response.meals)
    }

    // SEARCH
    async function searchByName(term) {
        closeNav()
        displayedData.innerHTML = ""
        
        $("#inner-loader").css("height", "100vh");
        $("#home-page .lds-ripple").fadeIn(300)   
        
        let api = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
        let response = await api.json()

        let blackBox = `
        <div class="d-flex justify-content-center align-items-center text-warning vh-100">
            <h3 class="text-capitalize">the meal you are looking for isn't available</h3>
        </div>
        `
        // response.meals ? displayMeals(response.meals) : displayMeals([])
        response.meals ? displayMeals(response.meals) : displayedData.innerHTML = blackBox

        $("#home-page .lds-ripple").fadeOut(300, function () {  
            $("#inner-loader").css("height", "0");
        })
    }

    async function searchByFirstLetter(term) {
        closeNav()
        displayedData.innerHTML = ""
        
        $("#inner-loader").css("height", "100vh");
        $("#home-page .lds-ripple").fadeIn(300)   
        
        if(term == ""){ term="m" }

        let api = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${term}`)
        let response = await api.json()

        let blackBox = `
        <div class="d-flex justify-content-center align-items-center text-warning vh-100">
            <h3 class="text-capitalize">there's no meal starts with this letter</h3>
        </div>
        `
        response.meals ? displayMeals(response.meals) : displayedData.innerHTML = blackBox
        // response.meals ? displayMeals(response.meals) : displayMeals([])
        
        $("#home-page .lds-ripple").fadeOut(300, function () {  
            $("#inner-loader").css("height", "0");
        })
    }

    function displaySearch() {
        searchDiv.innerHTML = `
        <div class="row py-4">
        <div class="col-md-6">
          <input type="search" class="form-control border-warning bg-transparent text-white" placeholder="Search By Name" onkeyup="searchByName(this.value)">
        </div>
        <div class="col-md-6">
          <input type="search" class="form-control border-warning bg-transparent text-white" placeholder="Search By First Letter" onkeyup="searchByFirstLetter(this.value)">
        </div>
      </div>
        `
        displayedData.innerHTML = ""
    }

    // CATEGORIES
    let categoriesLi = document.getElementById('categoriesLi')
    categoriesLi.addEventListener('click', function () {
        getCategories()
        closeNav()
    })

    async function getCategories() {
        searchDiv.innerHTML = ""
        displayedData.innerHTML = ""
        
        $("#inner-loader").css("height", "100vh");
        $("#home-page .lds-ripple").fadeIn(300)  

        let api = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
        let response = await api.json()

        displayCategories(response.categories)

        $("#home-page .lds-ripple").fadeOut(300, function () {  
            $("#inner-loader").css("height", "0");
        })
    }

    function displayCategories(arrItems) {
        let blackBox = ``
        for (let i = 0; i < arrItems.length; i++) {
            blackBox += `
            <div class="col-md-3">
                <div class="meal position-relative overflow-hidden cursor-pointer" onclick="getCategoryMeals('${arrItems[i].strCategory}')">
                <img src="${arrItems[i].strCategoryThumb}" alt="${arrItems[i].strCategory}" class="w-100 rounded-2">
                <div class="meal-layer position-absolute rounded-2 text-center text-black p-2">
                    <h3 class="text-capitalize mb-0">${arrItems[i].strCategory}</h3>
                    <p class="p-1 mb-1">${arrItems[i].strCategoryDescription.split(" ").slice(0, 20).join(" ")}</p>
                </div>
                </div>
            </div>
            `
        }
        displayedData.innerHTML = blackBox
    }

    async function getCategoryMeals(category){
        displayedData.innerHTML = ""
        
        $("#inner-loader").css("height", "100vh");
        $("#home-page .lds-ripple").fadeIn(300) 

        let api = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
        let response = await api.json()

        displayMeals(response.meals.slice(0, 20))

        $("#home-page .lds-ripple").fadeOut(600, function () {  
            $("#inner-loader").css("height", "0");
        })
    }


    // AREA
    let areaLi = document.getElementById('areaLi')
    areaLi.addEventListener('click', function () {
        getArea()
        closeNav()
    })

    async function getArea() {
        searchDiv.innerHTML = ""
        displayedData.innerHTML = ""
        
        $("#inner-loader").css("height", "100vh");
        $("#home-page .lds-ripple").fadeIn(300)  

        let api = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list')
        let response = await api.json()

        displayArea(response.meals)

        $("#home-page .lds-ripple").fadeOut(300, function () {  
            $("#inner-loader").css("height", "0");
        })
    }

    function displayArea(arrItems) {
        let blackBox =``
        for (let i = 0; i < arrItems.length; i++) {
            blackBox +=`
            <div class="col-md-3">
                <div onclick="getAreaMeal('${arrItems[i].strArea}')" class="rounded-2 text-center cursor-pointer">
                        <i class="fa-solid fa-house-laptop fa-4x"></i>
                        <h3>${arrItems[i].strArea}</h3>
                </div>
            </div>`
        }
        displayedData.innerHTML = blackBox
    }

    async function getAreaMeal(area) {
        displayedData.innerHTML = ""
        $("#inner-loader").css("height", "100vh");
        $("#home-page .lds-ripple").fadeIn(300)  
    
        let api = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`)
        let response = await api.json()
    
        displayMeals(response.meals.slice(0, 20))

        $("#home-page .lds-ripple").fadeOut(600, function () {  
            $("#inner-loader").css("height", "0");
        })
    }

    // INGREDIENTS
    async function getIngredients() {
        searchDiv.innerHTML = ""
        displayedData.innerHTML = ""
        
        $("#inner-loader").css("height", "100vh");
        $("#home-page .lds-ripple").fadeIn(300) 
        
        let api = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`)
        let response = await api.json()

        displayIngredients(response.meals.slice(0, 20))

        $("#home-page .lds-ripple").fadeOut(300, function () {  
            $("#inner-loader").css("height", "0");
        })
    }

    function displayIngredients(arrItems) {
        let blackBox = ``

        for (let i = 0; i < arrItems.length; i++) {
            blackBox += `
            <div class="col-md-3">
                    <div onclick="getIngredientsMeals('${arrItems[i].strIngredient}')" class="rounded-2 text-center cursor-pointer">
                            <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                            <h3>${arrItems[i].strIngredient}</h3>
                            <p>${arrItems[i].strDescription.split(" ").slice(0, 20).join(" ")}</p>
                    </div>
            </div>
            `
        }
    
        displayedData.innerHTML = blackBox
    }

    async function getIngredientsMeals(ingredient) {
        displayedData.innerHTML = ""

        $("#inner-loader").css("height", "100vh");
        $("#home-page .lds-ripple").fadeIn(300)  

        let api = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`)
        let response = await api.json()

        displayMeals(response.meals.slice(0,20))

        $("#home-page .lds-ripple").fadeOut(300, function () {  
            $("#inner-loader").css("height", "0");
        })
    }

    // CONTACT US
    function contactUs(){
        searchDiv.innerHTML = ""
        displayedData.innerHTML =`
        <section class="contact min-vh-100 d-flex justify-content-center align-items-center">
            <div class="container text-center">
            <div class="row g-md-4">
                <div class="col-md-6">
        
                <input type="text" placeholder="Enter Your Name" class="form-control py-2 mb-2 border-warning text-white bg-transparent" id="uName" required>
                <div class="alert alert-warning d-none text-capitalize py-2" id="name-alert"></div>
        
                <input type="number" class="form-control py-2 mb-2 bg-transparent border-warning text-white" placeholder="Enter Your Phone Number" id="phoneNumber" required>
                <div id="phoneAlert" class="alert alert-warning d-none text-capitalize py-2"></div>
        
                <div class="input-icon position-relative">
                    <input type="password" placeholder="Enter Your Password" class="form-control py-2 mb-2 bg-transparent border-warning text-white" id="uPassword" required>
                    <i class="bi bi-eye-fill position-absolute eye-icon" id="eye-icon"></i>
                    <div class="alert alert-warning d-none text-capitalize py-2 mt-2" id="pass-alert"></div>
                </div>
                </div>
        
                <div class="col-md-6">
        
                <input type="email" placeholder="Enter Your Email" class="form-control py-2 mb-2 bg-transparent border-warning text-white" id="uEmail" required>
                <div class="alert alert-warning d-none text-capitalize py-2" id="email-alert"></div>
        
                <input id="ageInput" type="number" class="form-control py-2 mb-2 bg-transparent border-warning text-white" placeholder="Enter Your Age" required>
                <div id="ageAlert" class="alert alert-warning d-none text-capitalize py-2 w-100"></div>
        
                    <input type="password" placeholder="Re-enter Your Password" class="form-control py-2 mb-2 bg-transparent border-warning text-white" id="re-uPassword" required>
                    <div class="alert alert-warning d-none text-capitalize py-2 mt-2" id="re-pass-alert"></div>
                </div>
            </div>
        
            <p class="text-success m-3 fw-bolder d-none" id="successText">Success</p>
            
            <button class="btn btn-outline-warning my-2" id="sumbit" disabled>Submit</button>
            </div>
        
        </section>
        `

        document.getElementById("uName").addEventListener("focus", () => {
            document.getElementById('successText').classList.add('d-none')
        })

        document.getElementById("uName").addEventListener('blur', function () {
            nameValidation()
            allValid()
        })
        
        document.getElementById("uEmail").addEventListener('blur', function () {
            emailValidation()
            allValid()
        })
    
        document.getElementById("phoneNumber").addEventListener("blur", () => {
            phoneValidation()
            allValid()
        })
    
        document.getElementById("ageInput").addEventListener("blur", () => {
            ageValidation()
            allValid()
        })
    
        document.getElementById('uPassword').addEventListener('blur', function () {
            passwordValidation()
            allValid()
            if (document.getElementById('uPassword').type != "password") {
                document.getElementById('uPassword').type = "password"
            }
        })
    
        document.getElementById("re-uPassword").addEventListener("blur", () => {
            rePasswordValidation()
            allValid()
        })

        document.getElementById('eye-icon').addEventListener('mouseenter', function () {
            if (document.getElementById('uPassword').type === "password") {
                document.getElementById('uPassword').type = "text";
            } else {
                document.getElementById('uPassword').type = "password";
            }
        })

        document.getElementById('sumbit').addEventListener('click', function () {
            document.getElementById('successText').classList.remove('d-none')
            clearForm()
        })

    }

    let namevalid = false,
        emailvalid = false,
        passvalid = false,
        repassvalid = false,
        phonevalid = false,
        agevalid = false;

    function allValid(){
        if(namevalid && emailvalid && passvalid && repassvalid && phonevalid && agevalid){
            document.getElementById('sumbit').removeAttribute('disabled')
        }
    }
        
    function clearForm() {
        document.getElementById('uName').value = ""
        document.getElementById('uEmail').value = ""
        document.getElementById('uPassword').value = ""
        document.getElementById('re-uPassword').value = ""
        document.getElementById("phoneNumber").value = ""
        document.getElementById("ageInput").value = ""

        document.getElementById('uName').classList.remove('is-valid')
        document.getElementById('uEmail').classList.remove('is-valid')
        document.getElementById('uPassword').classList.remove('is-valid')
        document.getElementById('re-uPassword').classList.remove('is-valid')
        document.getElementById("phoneNumber").classList.remove('is-valid')
        document.getElementById("ageInput").classList.remove('is-valid')
    }

    function nameValidation() {
        if (document.getElementById('uName').value != '') {
            if (/^[A-Z]/.test(document.getElementById('uName').value) == true) {
                if (/[a-z]{3,10}$/.test(document.getElementById('uName').value) == true) {
                    document.getElementById('name-alert').classList.add('d-none')
                    document.getElementById('uName').classList.add('is-valid')
                    document.getElementById('uName').classList.remove('is-invalid')
                    namevalid = true
                }
                else {
                    document.getElementById('name-alert').innerHTML = `<p class="fw-bold text-start m-0">the capital letter should be followed with 3 to 10 small letters</p>`
                    nameNotValid()
                }
            }
            else {
                document.getElementById('name-alert').innerHTML = `<p class="fw-bold text-start m-0">the input must start with a capital letter</p>`
                nameNotValid()
            }
        }
        else {
            document.getElementById('name-alert').innerHTML = `<p class="fw-bold text-start m-0">please enter your name</p>`
            nameNotValid()
        }
    }
    
    function nameNotValid() {
        document.getElementById('uName').classList.add('is-invalid')
        document.getElementById('uName').classList.remove('is-valid')
        document.getElementById('name-alert').classList.remove('d-none')
    }
    
    function emailValidation() {
        let regex = /^\w+[\+\.\w-]*@([\w-]+\.)*\w+[\w-]*\.([a-z]{2,4}|\d+)$/i 
        if (document.getElementById('uEmail').value != '') {
            if (regex.test(document.getElementById('uEmail').value) == true) {
                document.getElementById('uEmail').classList.add('is-valid')
                document.getElementById('uEmail').classList.remove('is-invalid')
                document.getElementById('email-alert').classList.add('d-none')
                emailvalid = true
            } else {
                document.getElementById('email-alert').innerHTML = `<p class="fw-bold text-start m-0">please enter a valid email</p>`
                emailNotValid()
            }
        }
        else {
            document.getElementById('email-alert').innerHTML = `<p class="fw-bold text-start m-0">please enter your email</p>`
            emailNotValid()
        }
    
    }
    
    function emailNotValid() {
        document.getElementById('uEmail').classList.add('is-invalid')
        document.getElementById('uEmail').classList.remove('is-valid')
        document.getElementById('email-alert').classList.remove('d-none')
    }
    
    function passwordValidation() {
        let userPass = document.getElementById('uPassword').value
    
        if (userPass != '') {
            if (userPass.length == 8) {
                if (userPass.search(/[0-9]/) != -1) {
                    if (userPass.search(/[a-z]/) != -1) {
                        if (userPass.search(/[A-Z]/) != -1) {
                            if (userPass.search(/[!\@\#\$\%\^\&\*\(\)\_\+\=\.\?\;\:\'\`\-]/) != -1) {
                                document.getElementById('uPassword').classList.add('is-valid')
                                document.getElementById('uPassword').classList.remove('is-invalid')
                                document.getElementById('pass-alert').classList.add('d-none')
                                passvalid = true
                            } else {
                                document.getElementById('pass-alert').innerHTML = `<p class="fw-bold text-start m-0">password must contain at least 1 special character</p>`
                                passNotValid()
                            }
                        } else {
                            document.getElementById('pass-alert').innerHTML = `<p class="fw-bold text-start m-0">password must contain at least 1 capital letter</p>`
                            passNotValid()
                        }
                    } else {
                        document.getElementById('pass-alert').innerHTML = `<p class="fw-bold text-start m-0">password must contain at least 1 small letter</p>`
                        passNotValid()
                    }
                } else {
                    document.getElementById('pass-alert').innerHTML = `<p class="fw-bold text-start m-0">password must contain at least 1 number</p>`
                    passNotValid()
                }
    
            } else if (userPass.length > 8) {
                document.getElementById('pass-alert').innerHTML = `<p class="fw-bold text-start m-0">password is too long. it should be 8 characters</p>`
                passNotValid()
            }
            else if (userPass.length < 8) {
                document.getElementById('pass-alert').innerHTML = `<p class="fw-bold text-start m-0">password is too short. it should be 8 characters</p>`
                passNotValid()
            }
        }
        else {
            document.getElementById('pass-alert').innerHTML = `<p class="fw-bold text-start m-0">please enter your password</p>`
            passNotValid()
            return false
        }
    }
    
    function passNotValid() {
        document.getElementById('uPassword').classList.remove('mb-4')
        document.getElementById('uPassword').classList.add('is-invalid')
        document.getElementById('uPassword').classList.remove('is-valid')
        document.getElementById('pass-alert').classList.remove('d-none')
    }

    function phoneValidation() {
        let regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
        if(document.getElementById('phoneNumber').value != ''){
            if(regex.test(document.getElementById('phoneNumber').value) == true){
                document.getElementById('phoneNumber').classList.add('is-valid')
                document.getElementById('phoneNumber').classList.remove('is-invalid')
                document.getElementById('phoneAlert').classList.add('d-none')
                phonevalid = true
            }else {
                document.getElementById('phoneAlert').innerHTML = `<p class="fw-bold text-start m-0">please enter a valid phone number</p>`
                phoneNotValid()
            }
        }else{
            document.getElementById('phoneAlert').innerHTML = `<p class="fw-bold text-start m-0">please enter your phone number</p>`
            phoneNotValid()
        }
    }

    function phoneNotValid() {
        document.getElementById('phoneNumber').classList.remove('mb-4')
        document.getElementById('phoneNumber').classList.add('is-invalid')
        document.getElementById('phoneNumber').classList.remove('is-valid')
        document.getElementById('phoneAlert').classList.remove('d-none')
    }
    
    function ageValidation() {
        let regex = /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/
        if(document.getElementById('ageInput').value != ''){
            if(regex.test(document.getElementById('ageInput').value)==true){
                document.getElementById('ageInput').classList.add('is-valid')
                document.getElementById('ageInput').classList.remove('is-invalid')
                document.getElementById('ageAlert').classList.add('d-none')
                agevalid = true
            }else {
                document.getElementById('ageAlert').innerHTML = `<p class="fw-bold text-start m-0">please enter a valid age</p>`
                ageNotValid()
            }
        }else{
            document.getElementById('ageAlert').innerHTML = `<p class="fw-bold text-start m-0">please enter your age</p>`
            ageNotValid()
        }
    }

    function ageNotValid() {
        document.getElementById('ageInput').classList.remove('mb-4')
        document.getElementById('ageInput').classList.add('is-invalid')
        document.getElementById('ageInput').classList.remove('is-valid')
        document.getElementById('ageAlert').classList.remove('d-none')
    }

    function rePasswordValidation() {
        if(document.getElementById("re-uPassword").value != ''){
            if (document.getElementById("re-uPassword").value == document.getElementById("uPassword").value) {
                document.getElementById('re-uPassword').classList.add('is-valid')
                document.getElementById('re-uPassword').classList.remove('is-invalid')
                document.getElementById('re-pass-alert').classList.add('d-none')
                repassvalid = true
            }else{
                document.getElementById('re-pass-alert').innerHTML = `<p class="fw-bold text-start m-0">the entered password is not compatible with your password</p>`
                rePasswordNotValid()
            }
        }else{
            document.getElementById('re-pass-alert').innerHTML = `<p class="fw-bold text-start m-0">please re-enter your password</p>`
            rePasswordNotValid()
        }
        
    }

    function rePasswordNotValid() {
        document.getElementById('re-uPassword').classList.remove('mb-4')
        document.getElementById('re-uPassword').classList.add('is-invalid')
        document.getElementById('re-uPassword').classList.remove('is-valid')
        document.getElementById('re-pass-alert').classList.remove('d-none')
    }