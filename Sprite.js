function Sprite (x, y, largura, altura){
	this.x = x;
	this.y = y;
	this.largura = largura;
	this.altura = altura;

	this.desenha = function(xCanvas, yCanvas){
		ctx.drawImage(img, this.x, this.y, this.largura, this.altura, xCanvas, yCanvas, this.largura, this.altura);
	}
}

var bg = new Sprite(0, 0, 600, 600),
spriteBoneco = new Sprite(624, 20, 84, 54),

perdeu = new Sprite(726, 393, 413, 160),
jogar = new Sprite(798, 98, 186, 87),
novo = new Sprite(603, 127, 397, 347),
spriteRecord = new Sprite(918, 491, 257, 214),
spriteChao = new Sprite(0, 598, 600, 100);