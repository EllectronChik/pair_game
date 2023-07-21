addEventListener('DOMContentLoaded', () => {
    let gameStarted = false;
    let victory = false;
    function createField() {    
        for (let i = 0; i < cnt; i++) {
            let row = document.createElement('div');
            row.classList.add('hero__row');
            row.classList.add(`hero__row__${cnt}__${i}`);
            row.classList.add(`hero__row__${cnt}`);
            for (let j = 0; j < cnt; j++) {
                let cell = document.createElement('div');
                cell.classList.add('hero__cell');
                cell.classList.add(`hero__cell__${cnt}`);
                cell.classList.add(`hero__cell__${cnt}__${i}__${j}`);
                cell.style.backgroundImage = `url(/images/back.svg)`;
                if (cnt < 5) {
                    cell.style.width = `${window.screen.width /  (parseInt(cnt) + 5)}px`;
                    cell.style.height = `${window.screen.width /  (parseInt(cnt) + 5)}px`;
                } else if (cnt == 6) {
                    cell.style.width = `${window.screen.width /  (parseInt(cnt) + 7)}px`;
                    cell.style.height = `${window.screen.width /  (parseInt(cnt) + 7)}px`;
                } else if (cnt == 8) {
                    cell.style.width = `${window.screen.width /  (parseInt(cnt) + 10)}px`;
                    cell.style.height = `${window.screen.width /  (parseInt(cnt) + 10)}px`;
                } else if (cnt == 10) {
                    cell.style.width = `${window.screen.width /  (parseInt(cnt) + 11)}px`;
                    cell.style.height = `${window.screen.width /  (parseInt(cnt) + 11)}px`;
                }
                row.appendChild(cell);
            }
            field.append(row);
            
        }
    }

    function start_game() {
        let form = document.getElementById('settings__form');
        let pairs = [];
        let choice = [];
        form.addEventListener('submit', (e) => {
            gameStarted = true;
            e.preventDefault();
            let timer = document.getElementById('settings__time').value;
            // console.log(timer);
            let element = document.documentElement;
            if (element.requestFullscreen) {
                element.requestFullscreen();
              } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
              } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
              } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen();
              }
              
              
            let cells = document.querySelectorAll('.hero__cell');
            generate_pairs(cells, pairs);
            console.log(pairs);
            timer_cntr(timer);
            player_choice(choice, pairs);
        })
    }

    function generate_pairs(cells, pairs) {
        let cards = [];
        let random = Math.floor(Math.random() * cells.length);
        for (let i = 0; i < cells.length; ) {
            if (!cards.includes(random)) {
                cards.push(random);
                i++;
            } else {
                random = Math.floor(Math.random() * cells.length);}
        }

        for (let i = 0; i < cards.length; i+=2) {
            let m_1 = Math.floor(parseInt(cards[i]) / cnt);
            let n_1 = parseInt(cards[i]) % cnt;

            let pair_1 = `hero__cell__${cnt}__${m_1}__${n_1}`;
            document.querySelector(`.${pair_1}`).classList.add(`not_image_${i / 2}`);
            console.log(`not_image_${i / 2}`);
            let m_2 = Math.floor(parseInt(cards[i+1]) / cnt);
            let n_2 = parseInt(cards[i+1]) % cnt;
            let pair_2 = `hero__cell__${cnt}__${m_2}__${n_2}`;
            document.querySelector(`.${pair_2}`).classList.add(`not_image_${i / 2}`);
            pairs.push([pair_1, pair_2]);
        }
    }

    function timer_cntr(timer) {
        let timer_ID;
        clearInterval(timer_ID);
        timer_ID = setInterval(() => {
            if(gameStarted && timer > 0) {
                // console.log(timer);
                timer--;
                document.getElementById('settings__timer').textContent = timer;
                document.getElementById('settings__time').value = timer;
            } else {
                clearInterval(timer_ID);
                gameEnd();
            }
        }, 1000);
    }

    function player_choice(choice, pairs) {
        let show_ID;
        let img_ID;
        let cell_clicked;
        document.querySelectorAll('.hero__cell').forEach(cell => {
            cell.addEventListener('click', (e) => {
                if (cell_clicked == e.target) {
                    return;
                }
                cell_clicked = e.target;
                if (gameStarted && choice.length < 2) {
                    clearTimeout(show_ID);
                    clearTimeout(img_ID);
                    cell.classList.add('clicked');
                    img_ID = setTimeout(() => {
                        for (let i = 0; i <= cnt * cnt / 2; i++) {
                            if (cell.classList.contains(`not_image_${i}`)) {
                                cell.classList.remove(`not_image_${i}`);
                                cell.classList.add(`image_${i}`);
                                console.log(`image_${i}`);
                                break;
                            }
                        }
                    }, 50)
                    let cell_class = e.target.classList.item(2);
                    choice.push(cell_class);
                    show_ID = setTimeout(() => {
                        if (choice.length === 2) {
                            // console.log(choice, pairs);
                            for(let pair of pairs) {
                                // console.log(pair, choice[0], choice[1], pair.includes(choice[0]) && pair.includes(choice[1]));
                                if (pair.includes(choice[0]) && pair.includes(choice[1])) {
                                    console.log('a_pair');
                                    pairs.splice(pairs.indexOf(pair), 1);
                                    document.querySelector(`.${choice[0]}`).classList.add('deleted');
                                    document.querySelector(`.${choice[1]}`).classList.add('deleted');
                                    if (pairs.length === 0) {
                                        victory = true;
                                        gameEnd();
                                    }
                                    break;
                                }
                            }
                            for (let i = 0; i <= cnt * cnt / 2; i++) {
                                if (document.querySelector(`.${choice[0]}`).classList.contains(`image_${i}`)) {
                                    document.querySelector(`.${choice[0]}`).classList.remove(`image_${i}`);
                                    document.querySelector(`.${choice[0]}`).classList.add(`not_image_${i}`);
                                }
                                if (document.querySelector(`.${choice[1]}`).classList.contains(`image_${i}`)) {
                                    document.querySelector(`.${choice[1]}`).classList.remove(`image_${i}`);
                                    document.querySelector(`.${choice[1]}`).classList.add(`not_image_${i}`);
                                }
                            }
                            document.querySelector(`.${choice[0]}`).classList.remove('clicked');
                            document.querySelector(`.${choice[1]}`).classList.remove('clicked');  
                            cell_clicked = null;
                            choice = [];
                        }
                    }, 1000)

                }
            })
        })
    }

    function gameEnd() {
        console.log('end');
        let hero = document.querySelector('.hero__container');
        hero.innerHTML = '';
        let final_block = document.createElement('div');
        let alert = document.createElement('h2');
        if (victory) {
            alert.textContent = 'Победа!';
        } else {
            alert.textContent = 'Поражение!';
        }
        final_block.classList.add('final_block');
        alert.classList.add('alert');
        alert.classList.add(`alert__${victory ? 'victory' : 'defeat'}`);
        hero.append(final_block);
        final_block.append(alert);
        gameStarted = false;
        document.getElementById('settings__count').textContent = cnt * cnt;
        while (field.firstChild) {
            field.firstChild.remove();
        }
        createField();
          
    }


    let cnt = 4;
    let field = document.querySelector('.hero__container');

    document.getElementById('settings__time').addEventListener('input', (e) => {
        if (!gameStarted) {
            document.getElementById('settings__timer').textContent = e.target.value;
        }
    })

    createField();

    document.getElementById('settings__range').addEventListener('input', (e) => {
        if (!gameStarted) {
            cnt = e.target.value;
            document.getElementById('settings__count').textContent = cnt * cnt;
            while (field.firstChild) {
                field.firstChild.remove();
            }
            createField();
    }
    })

    start_game();
    
})