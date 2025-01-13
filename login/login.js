document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const icon = document.getElementById('iconSelect').value;

    const normalizedUsername = username.toLowerCase();

    if (!username) {
        alert('Please enter a valid username.');
        return;
    }

    const result = await window.electronAPI.setUserData({ username, icon });
    
    if (result.bonus > 0) {
        alert(`Congratulations! You have received ${result.bonus} coins for choosing a special name. Each special name can only be redeemed once.`);
    }
    
    if (normalizedUsername == 'gege') {
        alert('I hate you.')
    }
    
    window.location.href = '../profile/profile.html';
});