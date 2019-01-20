
			// Variáveis globais do jogo.
			// velocidade = 6pixels percorridos.
			var canvas, ctx, ALTURA, LARGURA, maxPulos = 3, velocidade = 6, estadoAtual, record, img,
			
			// Estados do jogo em que cada valor corresponde a uma ação do personagem e também a interação do cenário. A variável abaixo, se trata de uma variável mais complexa, pois contem condições.
			estados = {
				jogar: 0,
				jogando: 1,
				perdeu: 2
			},

			// Características do chão.
			chao = {
				y: 483,
				x: 0,
				altura: 50,

				atualiza: function () {
					this.x -= velocidade;
					// Quando o cenário decrementa até -600, o valor de x fica igual a zero.
					if (this.x <= -600)
					this.x = 0;
				},
				//A linha abaixo seleciona a cor do chão do cenário.
				//cor: "#ffdf70",

				//Método dentro de uma variável
				desenha: function() {
					//ctx.fillStyle = this.cor;
					spriteChao.desenha(this.x, this.y );
					spriteChao.desenha(this.x + spriteChao.largura, this.y);
				//↓ O ctx desenha o objeto na tela.
				//ctx.fillRect(0, this.y, LARGURA, this.altura);

				}

			};
			//Abaixo temos a classe bloco e uma posição do bloco no cenário.
			bloco = {
				y: 0,
				x: 3,
				
				
				//Tamanho,cor, velocidade e força do pulo do BLOCO.
				altura: spriteBoneco.altura,
				largura: spriteBoneco.largura,
				gravidade: 1.0,
				velocidade: 0,
				forcaDoPulo: 20,
				qntPulos: 0,
				score: 0,
				rotacao: 0,

				atualiza: function() {
					this.velocidade += this.gravidade;
					this.y += this.velocidade;
					//3,14 divido por 180 é igual a um grau.
					this.rotacao += Math.PI / 180 * velocidade;

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

					if (this.score > record){
					localStorage.setItem("record", this.score);
					record = this.score;
					
					}
					
					this.score = 0;
				},
				//Desenha o bloco no cenário.
				desenha: function() {
					//ctx.fillStyle = this.cor;
					//ctx.fillRect(this.x, this.y, this.largura, this.altura);
					
					//Salva o contexto de toda a tela.
					ctx.save();

					

					//Como transladar o contexto:
					//O ponto âncora 0 do cenário soma com a largura e divide por dois, indo pro centro do personagem.
					ctx.translate(this.x + this.largura / 2, this.y + this.altura / 2);
				
				
					//Rotaciona o personagem depois de transladar o ponto X e Y do cenário.
					ctx.rotate(this.rotacao);
					
					//Dessa forma, o ponto âncora irá para meio do personagem, que é desenhado a partir do ponto X.	
					spriteBoneco.desenha(-this.largura / 2, -this.altura / 2);

					// Operações para rotacionar o contexto:
					ctx.restore();
					
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

				limpa: function() {
					this._obs = [];

				},
				desenha: function() {
					for (var i = 0, tam = this._obs.length; i < tam; i++) {
						var obs= this._obs[i];
						ctx.fillStyle = obs.cor;
						ctx.fillRect(obs.x, chao.y - obs.altura, obs.largura, obs.altura);
					}
				}
			};
			
			function clique(event) {
				if (estadoAtual == estados.jogando)
					bloco.pula();

				else if(estadoAtual == estados.jogar) {
					estadoAtual = estados.jogando;
				}
				
				else if (estadoAtual == estados.perdeu && bloco.y >= 2 * ALTURA){
					estadoAtual = estados.jogar	;
					//Limpa os obstaculos do cenário.
				obstaculos.limpa();
				bloco.reset();
				/*Se quiser que o bloco comece de cima no ponto 0.
				bloco.y = 0;
				bloco.velocidade = 0;*/
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
				ALTURA = 583;
			}
				canvas = document.createElement("canvas");
				canvas.width = LARGURA;
				canvas.height = ALTURA;
				canvas.style.border = "1px solid #000";

				ctx = canvas.getContext("2d")
				document.body.appendChild(canvas);

				document.addEventListener("mousedown", clique)
				
				record = localStorage.getItem("record");

				switch (record = 0) {
					case 0:
					  record == null;
					  img = new Image();
					  img.src = "C:/Users/H4CK3R/Desktop/Jogo/sheet.png";
	
					estadoAtual = estados.jogar;
					roda();
					  break;
					  
					
				  }
			}
			
			function roda() {
				atualiza();
				desenha();

				window.requestAnimationFrame(roda);
			}


			
			
			function atualiza() {

				if (estadoAtual == estados.jogando)	
				obstaculos.atualiza();
				chao.atualiza();
				bloco.atualiza();
			}

			
			function desenha() {
				/*ctx.fillStyle = "#50beff";
				ctx.fillRect(0, 0, LARGURA, ALTURA);*/
				bg.desenha(0, 0);
				
				//Desenha o texto na tela. Altura: 38 Largura: 26
				ctx.fillStyle = "#000";
				ctx.font = "50px Arial";
				ctx.fillText(bloco.score, 30, 60);

				//Chama métodos para desenhar o chão e o bloco
				if (estadoAtual == estados.jogando)
					obstaculos.desenha();
					
				chao.desenha();
				bloco.desenha();

				//Insere o "Jogar" no centro da tela quando subtraimos metade da largura e altura dividido por 2..					
				if (estadoAtual == estados.jogar){
					jogar.desenha(LARGURA / 2 - jogar.largura / 2, ALTURA / 2- jogar.altura / 2);
				}
					if (estadoAtual == estados.perdeu){
					perdeu.desenha(LARGURA / 2 - perdeu.largura / 2, ALTURA / 2 - perdeu.altura / 2 - spriteRecord.altura);

					spriteRecord.desenha(LARGURA / 2 - spriteRecord.largura / 2, ALTURA / 2 + perdeu.altura / 2 - spriteRecord.altura / 2);
				}
				
					

			}


			//inicializa o jogo
			main ();

	
