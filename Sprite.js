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
spriteBoneco = new Sprite(983, 17, 58, 53),

perdeu = new Sprite(1079, 209, 299, 81),
jogar = new Sprite(1079, 0, 319, 145),
novo = new Sprite(603, 127, 397, 347),
spriteRecord = new Sprite(1093, 290, 200, 180),
spriteChao = new Sprite(0, 620, 600, 100);
