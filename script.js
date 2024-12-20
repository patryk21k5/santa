class EscapeRoom {
	constructor() {
		this.accessPassword = 'chalina'
		this.allPuzzleSets = {
			set1: {
				1: {
					answer: 'eren7',
					hint: 'Imię głównego bohatera + numer odcinka transformacji',
					message: 'Świetnie! Pierwszy prezent jest Twój!',
				},
				2: {
					answer: 'jungkook97',
					hint: 'Imię najmłodszego + rok urodzenia',
					message: 'Brawo! Drugi prezent odkryty!',
				},
				3: {
					answer: 'marine2021',
					hint: 'Nazwa morskiej serii + rok wydania',
					message: 'Udało się! Ostatni prezent czeka!',
				},
			},
			set2: {
				1: {
					answer: 'titan150',
					hint: 'Nazwa tytana atakującego + wysokość muru',
					message: 'Wspaniale! Pierwszy prezent jest Twój!',
				},
				2: {
					answer: 'bts2013',
					hint: 'Nazwa zespołu + rok debiutu',
					message: 'Świetnie! Drugi prezent czeka!',
				},
				3: {
					answer: 'angel2006',
					hint: 'Nazwa figurek + rok pierwszej serii',
					message: 'Brawo! Ostatni prezent odkryty!',
				},
			},
			set3: {
				1: {
					answer: 'mikasa104',
					hint: 'Imię przyjaciółki + numer oddziału',
					message: 'Doskonale! Pierwszy prezent jest Twój!',
				},
				2: {
					answer: 'dynamite20',
					hint: 'Nazwa hitu + rok wydania',
					message: 'Super! Drugi prezent odkryty!',
				},
				3: {
					answer: 'blind180',
					hint: 'Typ pudełka + ilość stopni obrotu',
					message: 'Udało się! Trzeci prezent czeka!',
				},
			},
			set4: {
				1: {
					answer: 'levi160',
					hint: 'Imię kapitana + jego wzrost w centymetrach',
					message: 'Doskonale! Pierwszy prezent jest Twój!',
				},
				2: {
					answer: 'butter21',
					hint: 'Nazwa piosenki + rok wydania',
					message: 'Fantastycznie! Drugi prezent odkryty!',
				},
				3: {
					answer: 'sonny18',
					hint: 'Nazwa serii + liczba wariantów',
					message: 'Wspaniale! Ostatni prezent czeka!',
				},
			},
			set5: {
				1: {
					answer: 'historia845',
					hint: 'Imię królowej + rok upadku muru',
					message: 'Świetnie! Pierwszy prezent jest Twój!',
				},
				2: {
					answer: 'army7',
					hint: 'Nazwa fandomu + liczba członków',
					message: 'Idealnie! Drugi prezent odkryty!',
				},
				3: {
					answer: 'zodiac12',
					hint: 'Nazwa kolekcji + liczba znaków',
					message: 'Brawo! Ostatni prezent na Ciebie czeka!',
				},
			},
		}

		const sets = Object.keys(this.allPuzzleSets)
		const randomSet = sets[Math.floor(Math.random() * sets.length)]
		this.answers = this.allPuzzleSets[randomSet]
		this.selectedSet = randomSet.replace('set', '')

		this.currentRoom = 1
		this.attempts = {}
		this.maxAttempts = 30
		this.setupEventListeners()
		this.createSnowflakes()
		this.showSelectedRiddles()
	}

	showSelectedRiddles() {
		document.querySelectorAll('.riddle').forEach(riddle => {
			riddle.style.display = 'none'
			if (riddle.getAttribute('data-set') === this.selectedSet) {
				riddle.style.display = 'block'
			}
		})
	}

	setupEventListeners() {
		document.getElementById('startButton').addEventListener('click', () => {
			this.checkAccessPassword()
		})

		document.addEventListener('keypress', e => {
			if (e.key === 'Enter') {
				if (document.getElementById('passwordScreen').style.display !== 'none') {
					this.checkAccessPassword()
				} else {
					const activeRoom = document.querySelector('.room.active')
					if (activeRoom) {
						const roomId = parseInt(activeRoom.id.replace('room', ''))
						this.checkAnswer(roomId)
					}
				}
			}
		})
	}

	createSnowflakes() {
		const snowflakes = ['❄', '❅', '❆']
		for (let i = 0; i < 50; i++) {
			const snowflake = document.createElement('div')
			snowflake.className = 'snowflake'
			snowflake.textContent = snowflakes[Math.floor(Math.random() * snowflakes.length)]
			snowflake.style.left = Math.random() * 100 + 'vw'
			snowflake.style.animationDuration = Math.random() * 3 + 2 + 's'
			snowflake.style.opacity = Math.random()
			snowflake.style.fontSize = Math.random() * 20 + 10 + 'px'
			document.body.appendChild(snowflake)
		}
	}

	checkAccessPassword() {
		const password = document.getElementById('passwordInput').value.toLowerCase().trim()

		if (password === this.accessPassword) {
			document.getElementById('passwordScreen').style.display = 'none'
			document.querySelector('.container').style.display = 'block'
			document.getElementById('room1').classList.add('active')
		} else {
			this.showError(document.getElementById('passwordInput'), 'Nieprawidłowe hasło dostępu')
		}
	}

	async checkAnswer(roomNumber) {
		const input = document.getElementById(`answer${roomNumber}`)
		const answer = input.value.toLowerCase().trim()

		if (!this.attempts[roomNumber]) {
			this.attempts[roomNumber] = 0
		}

		if (answer === this.answers[roomNumber].answer) {
			await this.showSuccess(roomNumber)
			await this.transitionToNextRoom(roomNumber)
		} else {
			this.attempts[roomNumber]++
			await this.handleIncorrectAnswer(input, roomNumber)
		}
	}

	async showSuccess(roomNumber) {
		const successMessage = document.createElement('div')
		successMessage.className = 'success-message'
		successMessage.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <p>${this.answers[roomNumber].message}</p>
        `

		const room = document.getElementById(`room${roomNumber}`)
		room.appendChild(successMessage)
		await this.wait(2000)
		successMessage.remove()
	}

	async handleIncorrectAnswer(input, roomNumber) {
		const errorMessage = 'Spróbuj jeszcze raz!'
		const errorDiv = document.createElement('div')
		errorDiv.className = 'error-message'
		errorDiv.textContent = errorMessage

		input.parentNode.appendChild(errorDiv)
		input.classList.add('error')

		await this.wait(2000)
		errorDiv.remove()
		input.classList.remove('error')

		if (this.attempts[roomNumber] >= this.maxAttempts) {
			this.showHint(this.answers[roomNumber].hint, roomNumber)
			this.attempts[roomNumber] = 0
		}
	}

	showHint(hint, roomNumber) {
		const hintElement = document.querySelector(`#room${roomNumber} .hint`)
		hintElement.textContent = `Podpowiedź: ${hint}`
		hintElement.classList.add('show')
		setTimeout(() => hintElement.classList.remove('show'), 5000)
	}

	async transitionToNextRoom(currentRoom) {
		const currentRoomElement = document.getElementById(`room${currentRoom}`)
		const nextRoomElement =
			currentRoom === 3 ? document.getElementById('final') : document.getElementById(`room${currentRoom + 1}`)

		currentRoomElement.classList.remove('active')
		nextRoomElement.classList.add('active')

		if (currentRoom === 3) {
			this.createConfetti()
		}
	}

	createConfetti() {
		const confetti = document.getElementById('confetti')
		for (let i = 0; i < 100; i++) {
			const particle = document.createElement('div')
			particle.className = 'confetti-particle'
			particle.style.setProperty('--delay', `${Math.random() * 5}s`)
			particle.style.setProperty('--rotation', `${Math.random() * 360}deg`)
			particle.style.left = `${Math.random() * 100}%`
			confetti.appendChild(particle)
		}
	}

	showError(input, message) {
		input.classList.add('error')
		const errorDiv = document.createElement('div')
		errorDiv.className = 'error-message'
		errorDiv.textContent = message
		input.parentNode.appendChild(errorDiv)

		setTimeout(() => {
			errorDiv.remove()
			input.classList.remove('error')
		}, 2000)
	}

	wait(ms) {
		return new Promise(resolve => setTimeout(resolve, ms))
	}
}

const game = new EscapeRoom()
