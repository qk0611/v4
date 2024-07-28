document.addEventListener('DOMContentLoaded', function() {
    const tenderForm = document.getElementById('tender-form');
    const tendersList = document.getElementById('tenders-list');
    const tenders = [];

    tenderForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const title = document.getElementById('title').value;
        const company = document.getElementById('company').value;
        const amount = document.getElementById('amount').value;
        const goal = document.getElementById('goal').value;
        const description = document.getElementById('description').value;
        const endDate = document.getElementById('endDate').value;

        if (!endDate) {
            alert('Пожалуйста, укажите срок окончания тендера.');
            return;
        }

        addTender(title, company, amount, goal, description, endDate);

        tenderForm.reset();
    });

    function addTender(title, company, amount, goal, description, endDate) {
        const tender = {
            title,
            company,
            amount,
            goal,
            description,
            endDate,
            bids: []
        };

        tenders.push(tender);
        displayTenders();
    }

    function displayTenders() {
        tendersList.innerHTML = '';

        tenders.forEach((tender, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>Название:</strong> ${tender.title}<br>
                <strong>Компания:</strong> ${tender.company}<br>
                <strong>Начальная сумма:</strong> $${tender.amount}<br>
                <strong>Цель:</strong> ${tender.goal}<br>
                <strong>Описание:</strong>
                <p>${tender.description}</p>
                <strong>Дата окончания:</strong>
                <p>${tender.endDate}</p>
                <strong>Текущие ставки:</strong>
                <ul id="bids-${index}">
                    ${tender.bids.map(bid => `<li>${bid.company}: $${bid.amount} (Контакты: ${bid.contact})</li>`).join('')}
                </ul>
                <form class="bid-form" data-index="${index}">
                    <label for="bidCompany">Название компании:</label>
                    <input type="text" class="bidCompany" name="bidCompany" required>
                    <label for="bidAmount">Ваша ставка:</label>
                    <input type="number" class="bidAmount" name="bidAmount" required>
                    <label for="bidContact">Контакты:</label>
                    <input type="text" class="bidContact" name="bidContact" required>
                    <button type="submit" class="btn">Сделать ставку</button>
                </form>
            `;
            tendersList.appendChild(li);
        });

        document.querySelectorAll('.bid-form').forEach(form => {
            form.addEventListener('submit', function(event) {
                event.preventDefault();
                const index = this.getAttribute('data-index');
                const bidCompany = this.querySelector('.bidCompany').value;
                const bidAmount = this.querySelector('.bidAmount').value;
                const bidContact = this.querySelector('.bidContact').value;
                addBid(index, bidCompany, bidAmount, bidContact);
            });
        });
    }

    function addBid(index, bidCompany, bidAmount, bidContact) {
        tenders[index].bids.push({ company: bidCompany, amount: Number(bidAmount), contact: bidContact });
        tenders[index].bids.sort((a, b) => a.amount - b.amount); // Сортируем ставки по возрастанию
        displayTenders();
    }

    // Функция для проверки тендеров и определения победителей
    setInterval(function() {
        const currentDate = new Date().toISOString().split('T')[0];
        tenders.forEach((tender, index) => {
            if (tender.endDate < currentDate && tender.bids.length > 0) {
                const winnerBid = tender.bids[0]; // Самая низкая ставка
                alert(`Тендер "${tender.title}" завершен! Победитель: ${winnerBid.company} с предложением $${winnerBid.amount}. Контакты: ${winnerBid.contact}`);
                // Удаляем завершенный тендер из списка
                tenders.splice(index, 1);
                displayTenders();
            }
        });
    }, 1000 * 60 * 60 * 24); // Проверяем раз в сутки
});
