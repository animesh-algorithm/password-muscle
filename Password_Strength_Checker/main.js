const progressBar = document.getElementById('progress-bar')
const passwordInput = document.getElementById('password-input')
const complexitySection = document.getElementById('complexities')
const hideButton = document.getElementById('hide')

hideButton.addEventListener('change', function() {
    passwordInput.type = 'text'
})

passwordInput.addEventListener('input', updateProgressBar)
updateProgressBar()

function updateProgressBar() {
    let password = passwordInput.value
    let complexities = calculatePasswordStrength(password)
    let strength = 100
    complexitySection.innerHTML = ''
    complexities.forEach(complexity => {
        if (complexity == undefined) return 
        strength -= complexity.deduction
        let messageElement = document.createElement('div')
        messageElement.innerHTML = complexity.message
        complexitySection.appendChild(messageElement)
    })
    progressBar.style.setProperty('--strength', strength)
}

function calculatePasswordStrength(password) {
    let complexities = []
    complexities.push(lengthComplexity(password))
    complexities.push(lowerCaseComplexity(password))
    complexities.push(upperCaseComplexity(password))
    complexities.push(numericComplexity(password))
    complexities.push(specialCharacterComplexity(password))
    complexities.push(repeatCharacterComplexity(password))
    // console.log(complexities)
    return complexities
}

function lengthComplexity(password) {
    let length = password.length
    if (length == 0) {
        return {
            message: "You haven't entered the password yet.",
            deduction: 100
        }
    }
    if (length >= 5 && length < 8) {
        return {
            message: 'Password must be 8 characters long.',
            deduction: 20
        }
    }
    if (length <= 4) {
        return {
            message: 'Your password is too short.',
            deduction: 50
        }
    }
    if (length <= 10) {
        return {
            message: 'Your password could be longer.',
            deduction: 15
        }
    }
}

function lowerCaseComplexity(password) {
    return characterTypeComplexity(password, /[a-z]/g, 'lowercase')
}

function upperCaseComplexity(password) {
    return characterTypeComplexity(password, /[A-Z]/g, 'uppercase')
}

function numericComplexity(password) {
    return characterTypeComplexity(password, /[0-9]/g, 'numeric')
}

function specialCharacterComplexity(password) {
    return characterTypeComplexity(password, /[^0-9a-zA-Z\s]/g, 'special')
}

function characterTypeComplexity(password, regex, type) {
    if (password.match) {
        let matches = password.match(regex) || []
        if (matches.length === 0) {
            return {
                message: `Your password has no ${type} characters`,
                deduction: 20
            }
        }
        if (matches.length <= 2) {
            return {
                message: `Your password could use more ${type} characters`,
                deduction: 5
            }
        }
    }
}

function repeatCharacterComplexity(password) {
    let matches = password.match(/(.)\1/g) || []
    if (matches.length > 0) {
        return {
            message: "Your password has repeat characters",
            deduction: matches.length * 10
        }
    }
}