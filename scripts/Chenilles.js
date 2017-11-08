function Anneau(x, y, rayon)
{
	this.x = x;
	this.y = y;
	this.rayon = rayon;
};

Anneau.prototype.fillColor = "red";

Anneau.prototype.dessiner = function(canvas)
{
	var ctx = canvas.getContext("2d");
	ctx.beginPath();
	ctx.arc(this.x,this.y,this.rayon,0,Math.PI*2);
	ctx.fillStyle=this.fillColor;
	ctx.strokeStyle="black";
	ctx.fill();
	ctx.stroke();
};

function Paire(x,y,rayon)
{
	Anneau.call(this,x,y,rayon);
};

Paire.prototype.fillColor = "pink";

Paire.prototype.dessiner = function(canvas)
{
	var ctx = canvas.getContext("2d");
	ctx.beginPath();
	ctx.arc(this.x,this.y+this.rayon,this.rayon,0,Math.PI*2);
	ctx.fillStyle=this.fillColor;
	ctx.strokeStyle="black";
	ctx.fill();
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(this.x,this.y-this.rayon,this.rayon,0,Math.PI*2);
	ctx.fill();
	ctx.stroke();
};

function Tete(x, y, rayon, cap)
{
	Anneau.call(this,x,y,rayon)
	this.cap = cap;
};

Tete.prototype.fillColor = "black";

Tete.prototype.__proto__ = Anneau.prototype;

Tete.prototype.devierCap = function(deltaC)
{
	this.cap += deltaC;
};

Tete.prototype.deplacerSelonCap = function()
{
	this.x += this.rayon*Math.cos(this.cap);
 	this.y += this.rayon*Math.sin(this.cap);
};

Tete.prototype.capOK = function(canvas)
{
	return (
		((this.x+this.rayon*Math.cos(this.cap)) >= this.rayon) && 
		((this.x+this.rayon*Math.cos(this.cap)) <= (canvas.width - this.rayon)) &&
		((this.y+this.rayon*Math.sin(this.cap)) >= this.rayon) &&
		((this.y+this.rayon*Math.sin(this.cap)) <= (canvas.height - this.rayon))
	);
};


function Chenille(x,y,rayon,nbAnneaux)
{
	this.x = x;
	this.y = y;
	this.rayon = rayon;
	this.nbAnneaux = nbAnneaux;
	this.chenille = [];
	//this.chenille.push(new Paire(this.x-this.nbAnneaux*this.rayon,this.y,this.rayon*1.5));
	for (var i=this.nbAnneaux ; i>=0 ; i--)
	{
		this.chenille.push(new Anneau(this.x-i*this.rayon,this.y,this.rayon));
	}
	this.chenille.push(new Tete(this.x,this.y,this.rayon,0));
};


Chenille.prototype.dessiner = function(canvas)
{
	for (i in this.chenille)
	{
		this.chenille[i].dessiner(canvas);
	}
};

Chenille.prototype.deplacer = function(canvas)
{
	var cap = Math.random() * 2*0.52 - 0.52;
	this.chenille[this.chenille.length-1].devierCap(cap);	
	while (!this.chenille[this.chenille.length-1].capOK(canvas))
	{
		cap = Math.random() * 2*0.18 - 0.18;
		this.chenille[this.chenille.length-1].devierCap(cap);
	}
	this.chenille[this.chenille.length-1].deplacerSelonCap();
	for (var i=0 ; i < this.chenille.length-1 ; i++)
	{
		this.chenille[i].x = this.chenille[i+1].x;
		this.chenille[i].y = this.chenille[i+1].y;
	};
};



function init()
{  
	var canvas = document.getElementById("myCanvas");
	var ctxt = canvas.getContext("2d");
	var nbChenilles = 10;
	var chenilles = [];
	
	for ( var i=0 ; i < nbChenilles ; i++ )
	{
		chenilles.push(new Chenille(250,250,15,10));
		chenilles[i].dessiner(canvas);
	};

	document.getElementById("start").onclick = function()
	{
		document.getElementById("start").disabled = true;
		document.getElementById("pause").disabled = false;
		timerId = setInterval( function()
			{
				canvas.height=500;
				for (i in chenilles) {chenilles[i].deplacer(canvas);};
				for (i in chenilles) {chenilles[i].dessiner(canvas);};
			},100);
	};

	document.getElementById("pause").onclick = function()
	{
		document.getElementById("start").disabled = false;
		document.getElementById("pause").disabled = true;
		clearInterval(timerId);
	};

	document.getElementById("reset").onclick = function()
	{
		document.getElementById("start").disabled = false;
		document.getElementById("pause").disabled = true;
		clearInterval(timerId);
		ctxt.clearRect(0, 0, canvas.width, canvas.height);
		chenilles = [];
		for ( var i=0 ; i < nbChenilles ; i++ )
		{
			chenilles.push(new Chenille(250,250,15,10));
			chenilles[i].dessiner(canvas);
		};
	};

};
