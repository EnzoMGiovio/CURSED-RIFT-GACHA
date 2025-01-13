function handleButtonFeedback(buttonId) {
    const button = document.getElementById(buttonId);
    button.disabled = true;
    button.classList.add('button-flash');
    
    setTimeout(() => {
        button.disabled = false;
        button.classList.remove('button-flash');
    }, 1000);
}


function createCharacterHTML(character, isMulti) {
    return `
        <h3>${character.name}</h3>
        <p>Rarity: ${character.rarity}</p>
        <img class="character-image" src="${character.image}" alt="${character.name}">
    `;
}

async function updateUI() {
    try {
        const userData = await window.electronAPI.getUserData()
        document.getElementById('currency').textContent = userData.currency
    } catch (error) {
        console.error('Error updating UI:', error)
    }
}

async function roll(isMulti = false) {
    try {
        handleButtonFeedback(isMulti ? 'multiRollButton' : 'rollButton');

        const bannerSelect = document.getElementById('bannerSelect')
        const result = await window.electronAPI.performRoll({
            bannerType: bannerSelect.value,
            isMulti
        })
        
        if (!result.success) {
            alert(result.message)
            return
        }

        // Get the container elements
        const singleContainer = document.getElementById('singleCharacterDisplay')
        const multiContainer = document.getElementById('multiCharacterDisplay')
        
        // Clear both containers
        singleContainer.innerHTML = ''
        multiContainer.innerHTML = ''

        if (isMulti) {
            // Ocultar single y mostrar multi
            singleContainer.classList.remove('active')
            multiContainer.classList.add('active')

            // Display multiple characters
            result.characters.forEach((character, index) => {
                const charElement = document.createElement('div')
                charElement.className = 'character-card'
                charElement.setAttribute('data-rarity', character.rarity)
                charElement.style.animationDelay = `${index * 0.1}s`
                charElement.innerHTML = createCharacterHTML(character, true)
                multiContainer.appendChild(charElement)
            })
        } else {
            
            multiContainer.classList.remove('active')
            singleContainer.classList.add('active')

            // Display single character
            const character = result.characters[0]
            const charElement = document.createElement('div')
            charElement.className = 'character-card'
            charElement.setAttribute('data-rarity', character.rarity)
            charElement.innerHTML = createCharacterHTML(character, false)
            singleContainer.appendChild(charElement)
        }
        
        updateUI()
    } catch (error) {
        console.error('Error during roll:', error)
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('rollButton').addEventListener('click', () => roll(false))
    document.getElementById('multiRollButton').addEventListener('click', () => roll(true))
    updateUI()
})