
			// Variáveis globais do jogo.
			// velocidade = 6pixels percorridos.
			var canvas, ctx, ALTURA, LARGURA, frames = 0, maxPulos = 3, velocidade = 6, estadoAtual, recorde,
			
			// Estados do jogo em que cada valor corresponde a uma ação do personagem e também a interação do cenário. A variável abaixo, se trata de uma variável mais complexa, pois contem condições.
			estados = {
				jogar: 0,
				jogando: 1,
				perdeu: 2
			},

			// Características do chão.
			chao = {
				y: 550,
				altura: 50,
				cor: "#ffdf70",

				//Método dentro de uma variável
				desenha: function() {
					ctx.fillStyle = this.cor;

				//↓ O ctx desenha o objeto na tela.
				ctx.fillRect(0, this.y, LARGURA, this.altura);

				}

			};
			//Abaixo temos a classe bloco e uma posição do bloco no cenário.
			bloco = {
				x: 5,
				y: 0,

				//Tamanho,cor, velocidade e força do pulo do BLOCO.
				altura: 20,
				largura: 20,
				cor: "#ff4e4e",
				gravidade: 1.0,
				velocidade: 0,
				forcaDoPulo: 20,
				qntPulos: 0,
				score: 0,

				atualiza: function() {
					this.velocidade += this.gravidade;
					this.y += this.velocidade;

					if (this.y > chao.y - this.altura && estadoAtual != estados.perdeu){
						this.y = chao.y - this.altura;
						this.qntPulos = 0;
						this.velocidade = 0;
					}
				},

				//Função que faz o bloco pular.
				pula: function() {
					if (this.qntPulos < maxPulos){
					this.velocidade = -this.forcaDoPulo;
					this.qntPulos++;
					}
				},

				//Redefini os atributos do bloco.
				reset: function (){
					this.velocidade = 0;
					this.y = 0;

					if (this.score > recorde)
					localStorage.setItem("recorde", this.score);
					recorde = this.score;
					this.score = 0;
				},
				//Desenha o bloco no cenário.
				desenha: function() {
					ctx.fillStyle = this.cor;
					ctx.fillRect(this.x, this.y, this.largura, this.altura);
				}

			},

			obstaculos = {
				_obs: [],
				cores: ["#6A5ACD", "#483D8B", "#191970", "#000080", "#0000CD"],
				tempoInsere: 0,

				insere: function() {
					this._obs.push({
						x: LARGURA,
						//largura: 30 + Math.floor(20 * Math.random()),
						largura: 50, 
						altura: 30 + Math.floor(120 * Math.random()),
						cor: this.cores[Math.floor(5 * Math.random())]

					});

					this.tempoInsere = 30 + Math.floor(21 * Math.random());

				},
				atualiza: function(){
					if (this.tempoInsere== 0)
						this.insere();
					else
						this.tempoInsere--;

					for (var i = 0, tam = this._obs.length; i < tam; i++){
						var obs = this._obs[i];

						obs.x -= velocidade;

						if (bloco.x < obs.x + obs.largura && bloco.x + bloco.largura >= obs.x && bloco.y + bloco.altura >= chao.y - obs.altura){
							estadoAtual = estados.perdeu;
						

						}
						
						else if (obs.x == 0){
						bloco.score++;
					}
						else if(obs.x <= -obs.largura){
							this._obs.splice(i, 1);
							tam --;
							i --;
						}
					}
				},

				limpa: function(){
					this._obs = [];

				},
				desenha: function(){
					for(var i = 0, tam = this._obs.length; i < tam; i++) {
						var obs= this._obs[i];
						ctx.fillStyle = obs.cor;
						ctx.fillRect(obs.x, chao.y - obs.altura, obs.largura, obs.altura);
					}

				},
			};

			function clique (event) {
				if (estadoAtual == estados.jogando)
				bloco.pula();
				else if (estadoAtual == estados.jogar){
					estadoAtual = estados.jogando;
				}

				else if (estadoAtual == estados.perdeu){
					estadoAtual = estados.jogar;
					
					//Limpa os obstaculos do cenário.
					obstaculos.limpa();
					bloco.reset();

					//Se quiser que o bloco comece de cima no ponto 0.
					bloco.y = 0;
					bloco.velocidade = 0;
				}
			}
		
				
			function main() {
				ALTURA = window.innerHeight;
				LARGURA =  window.innerWidth;

				/* Ocupar cenário todo do jogo.
				if (LARGURA >= 500){
					LARGURA = 1358;
					ALTURA = 625;
			}*/
			if (LARGURA >= 500){
				LARGURA = 600;
				ALTURA = 600;
		}
				canvas = document.createElement("canvas");
				canvas.width = LARGURA;
				canvas.height = ALTURA;
				canvas.style.border = "1px solid #000";

				ctx = canvas.getContext("2d")
				document.body.appendChild(canvas);
				document.addEventListener("mousedown", clique)
				roda();
				recorde = localStorage.getItem("recorde");

				if (recorde == null)
					recorde = 0;
				

				estadoAtual = estados.jogar;
			}
			
			function roda() {
				atualiza();
				desenha();

				window.requestAnimationFrame(roda);
			}
			
			function atualiza() {
				frames++;

				bloco.atualiza();
				
				if (estadoAtual == estados.jogando)	
					obstaculos.atualiza();
					

			}
			
			function desenha() {
				ctx.fillStyle = "#50beff";
				ctx.fillRect(0, 0, LARGURA, ALTURA);
				
				//Desenha o texto na tela. Altura: 38 Largura: 26
				ctx.fillStyle = "#fff";
				ctx.font = "50px Courier";
				ctx.fillText(bloco.score, 30, 60);

				if (estadoAtual == estados.jogar) {
					ctx.fillStyle = "green";
					ctx.fillRect(LARGURA / 2 - 50 , ALTURA / 2 - 50, 100, 100);
				}
				else if (estadoAtual == estados.perdeu) {
					//Cor do background do quadrado de "perdeu".
					ctx.fillStyle = "#000";
					ctx.fillRect(LARGURA / 2 - 50 , ALTURA / 2 - 50, 100, 100);
					ctx.save();
					ctx.translate(LARGURA / 2, ALTURA / 2 );
					ctx.fillStyle = "#ffff";
					
				if (bloco.score < 10){
					// Posição do texto no cenário.
					ctx.fillText(bloco.score, -13, 19);

					}
				else if (bloco.score >= 10 && bloco.score <100)
					ctx.fillText(bloco.score, -26, 19);

				else 
					ctx.fillText(bloco.score, -39, 19);
					
					ctx.restore();
					

				}
				

				//Chama métodos para desenhar o chão e o bloco
				else if (estadoAtual == estados.jogando)
				obstaculos.desenha();

				chao.desenha();
				bloco.desenha();

			}


			//inicializa o jogo
			main ();

	