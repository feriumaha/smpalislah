/* Spry.Effect.js - Revision: Spry Preview Release 1.4 */

// (version 0.23)
//
// Copyright (c) 2006. Adobe Systems Incorporated.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//   * Neither the name of Adobe Systems Incorporated nor the names of its
//     contributors may be used to endorse or promote products derived from this
//     software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.



var Spry;

if (!Spry) Spry = {};

Spry.forwards = 1; // const
Spry.backwards = 2; // const

Spry.linearTransition = 1; // const
Spry.sinusoidalTransition = 2; // const

if (!Spry.Effect) Spry.Effect = {};

//////////////////////////////////////////////////////////////////////
//
// Spry.Effect.Registry
//
//////////////////////////////////////////////////////////////////////

Spry.Effect.Registry = function()
{
	this.elements = new Array();

	_AnimatedElement = function (element) 
	{
		this.element = element;
		this.currentEffect = -1;
		this.effectArray = new Array();
	};
	
	this.AnimatedElement = _AnimatedElement;

};
 
Spry.Effect.Registry.prototype.getRegisteredEffect = function(element, effect) 
{
	var eleIdx = this.getIndexOfElement(element);

	if (eleIdx == -1)
	{
		this.elements[this.elements.length] = new this.AnimatedElement(element);
		eleIdx = this.elements.length - 1;
	}

	var foundEffectArrayIdx = -1;
	for (var i = 0; i < this.elements[eleIdx].effectArray.length; i++) 
	{
		if (this.elements[eleIdx].effectArray[i])
		{
			if (this.effectsAreTheSame(this.elements[eleIdx].effectArray[i], effect))
			{
				foundEffectArrayIdx = i;
				//this.elements[eleIdx].effectArray[i].reset();
				if (this.elements[eleIdx].effectArray[i].isRunning == true) {
					//Spry.Debug.trace('isRunning == true');
					this.elements[eleIdx].effectArray[i].cancel();
				}
				this.elements[eleIdx].currentEffect = i;
				if (this.elements[eleIdx].effectArray[i].options && (this.elements[eleIdx].effectArray[i].options.toggle != null)) {
					if (this.elements[eleIdx].effectArray[i].options.toggle == true)
						this.elements[eleIdx].effectArray[i].doToggle();
				} else { // same effect name (but no options or options.toggle field)
					this.elements[eleIdx].effectArray[i] = effect;
				}

				break;
			}
		}
	}

	if (foundEffectArrayIdx == -1) 
	{
		var currEffectIdx = this.elements[eleIdx].effectArray.length;
		this.elements[eleIdx].effectArray[currEffectIdx] = effect;
		this.elements[eleIdx].currentEffect = currEffectIdx;
	}

	var idx = this.elements[eleIdx].currentEffect;
	return this.elements[eleIdx].effectArray[idx];
}

Spry.Effect.Registry.prototype.getIndexOfElement = function(element)
{
	var registryIndex = -1;
	for (var i = 0; i < this.elements.length; i++)
	{
		if (this.elements[i]) {
			if (this.elements[i].element == element)
				registryIndex = i;
		}
	}
	return registryIndex;
}

Spry.Effect.Registry.prototype.effectsAreTheSame = function(effectA, effectB)
{
	if (effectA.name != effectB.name) 
		return false;

	if(effectA.effectsArray) // cluster effect
	{
		if (!effectB.effectsArray || effectA.effectsArray.length != effectB.effectsArray.length)
			return false;

		for (var i = 0; i < effectA.effectsArray.length; i++)
		{
			if(!Spry.Effect.Utils.optionsAreIdentical(effectA.effectsArray[i].effect.options, effectB.effectsArray[i].effect.options))
				return false;
		}
	}
	else // single effect
	{
		if(effectB.effectsArray || !Spry.Effect.Utils.optionsAreIdentical(effectA.options, effectB.options))
			return false;
	}

	return true;
}

var SpryRegistry = new Spry.Effect.Registry;

//////////////////////////////////////////////////////////////////////
//
// Spry.Effect.Utils
//
//////////////////////////////////////////////////////////////////////

if (!Spry.Effect.Utils) Spry.Effect.Utils = {};

Spry.Effect.Utils.showError = function(msg)
{
	alert('Spry.Effect ERR: ' + msg);
}

Spry.Effect.Utils.Position = function()
{
	this.x = 0; // left
	this.y = 0; // top
	this.units = "px";
}

Spry.Effect.Utils.Rectangle = function()
{
	this.width = 0;
	this.height = 0;
	this.units = "px";
}

Spry.Effect.Utils.PositionedRectangle = function()
{
	this.position = new Spry.Effect.Utils.Position;
	this.rectangle = new Spry.Effect.Utils.Rectangle;
}

Spry.Effect.Utils.intToHex = function(integerNum) 
{
	var result = integerNum.toString(16);
	if (result.length == 1) 
		result = "0" + result;
	return result;
}

Spry.Effect.Utils.hexToInt = function(hexStr) 
{
	return parseInt(hexStr, 16); 
}

Spry.Effect.Utils.rgb = function(redInt, greenInt, blueInt) 
{
	
	var redHex = Spry.Effect.Utils.intToHex(redInt);
	var greenHex = Spry.Effect.Utils.intToHex(greenInt);
	var blueHex = Spry.Effect.Utils.intToHex(blueInt);
	compositeColorHex = redHex.concat(greenHex, blueHex);
	compositeColorHex = '#' + compositeColorHex;
	return compositeColorHex;
}

Spry.Effect.Utils.camelize = function(stringToCamelize)
{
    var oStringList = stringToCamelize.split('-');
	var isFirstEntry = true;
	var camelizedString = '';

	for(var i=0; i < oStringList.length; i++)
	{
		if(oStringList[i].length>0)
		{
			if(isFirstEntry)
			{
				camelizedString = oStringList[i];
				isFirstEntry = false;
			}
			else
			{
				var s = oStringList[i];
      			camelizedString += s.charAt(0).toUpperCase() + s.substring(1);
			}
		}
	}

	return camelizedString;
}

Spry.Effect.Utils.isPercentValue = function(value) 
{
	var result = false;
	try
	{
		if (value.lastIndexOf("%") > 0)
			result = true;
	}
	catch (e) {}
	return result;
}

Spry.Effect.Utils.getPercentValue = function(value) 
{
	var result = 0;
	try
	{
		result = Number(value.substring(0, value.lastIndexOf("%")));
	}
	catch (e) {Spry.Effect.Utils.showError('Spry.Effect.Utils.getPercentValue: ' + e);}
	return result;
}

Spry.Effect.Utils.getPixelValue = function(value) 
{
	var result = 0;
	try
	{
		result = Number(value.substring(0, value.lastIndexOf("px")));
	}
	catch (e) {}
	return result;
}

Spry.Effect.Utils.getFirstChildElement = function(node)
{
	if (node)
	{
		var childCurr = node.firstChild;

		while (childCurr)
		{
			if (childCurr.nodeType == 1) // Node.ELEMENT_NODE
				return childCurr;

			childCurr = childCurr.nextSibling;
		}
	}

	return null;
};

Spry.Effect.Utils.fetchChildImages = function(startEltIn, targetImagesOut)
{
	if(!startEltIn  || startEltIn.nodeType != 1 || !targetImagesOut)
		return;

	if(startEltIn.hasChildNodes())
	{
		var childImages = startEltIn.getElementsByTagName('img')
		var imageCnt = childImages.length;
		for(var i=0; i<imageCnt; i++)
		{
			var imgCurr = childImages[i];
			var dimensionsCurr = Spry.Effect.getDimensions(imgCurr);
			targetImagesOut.push([imgCurr,diY≈§z&ı≥^Xöºk0†\¨‡ƒ~$ hJs››:Mc‚) Á&7
~üàai$Z ¡`t0÷3EŸ4[-„˘ÛãI¡qŸ'0Ø»l+ßÊXiïÇúÌQaBTÓ
UæÜÑc∞ÛÌíq†‹]væ(„êﬁÇ€åvs«m{+7Ö_‚Ò¬˝q/*¯˛I¿êpqµ˘„]Û¯’hq%ö‰÷óE™Öù[—^-ä‘`@S¢$àdödc*˜jâ¥£‹åÕ1m©D≠ +®rò¢ˆÁ˛?)©≠5Rr‰lƒíO§(¸“§ÍEÚ8:æ'wP{ß±qªÍ3ù—cm∑ûÖ£_%ª¢XÄQ˚FÇ-»ÿ˝nCUÿ?◊c…ƒ,££òo€©åsÄE:Êö–µ„Rg8ÈY9Æ_™öﬂ!#ô†b®!Òˆû‚ó{Æqx‘
@õ|ÑÊˆfiÛ∆—úî™H∞ªÜÌN#8˜ì« „v“ˆ0bÂå|ÖÒÖ¨*Ø◊.QU!qC#∑÷ÓæÉw#â“[•w‰√≤ø™ €¶Zø÷≤m≈ö~“<åW5ãèñÓy…Üxﬁdä≤ŸS€ﬂ°ñ$∂`nÅÏ¯£òGÆ©pŒT<eœÚŒ‡Í¨jCdH˘èÉ 
Ó¸èÍô%ÊÏø\⁄è-G˘Ä‡¡çd⁄y¬Æ@]›&Ü 1d+¡Í∂[¨àÇñä— ÍÉS£zŒ3€pò£ùúæ˚XûëÌ^@?¸wz_éö¨Ωäôxù∂QK‘eÜ.©EÛÊ|ÈÊc´ëÏ5;Z}o(Æ=>O±∏;‡·†ëÄìMG„ÑêôgﬂL£!Zb-“\zÂoí2Úá‡9∫·yG› d|ËçŒùâæƒà˛ûc•BYqÚ≥ÉxÇÙ´πOŸ~”Œz€ñ°ùe`˙E
ù’X1®XgÍD¨˛mˇ3åYˇ≠ÇZ˘wÚ—∂ﬁﬂ»ª7}zç‘Ω;âL3⁄„∆ÑIOª_ªí£O∆<)<=Ú<∏…≥EÏ§Ü°J™Ÿ∏GËké§(Io*…€¿„ÏVqID7§¨QTJ
&"ØÑßîØªÇ'öÂΩl†+ùO*‚˙NÜf¬ÿØ4dBly˝Aœ›”U 8∆6ŒºO∞”@Ö`∏√37ÆK—&Âq+o∏xáÎÄÓ.’M-cLNπâMX°~bﬁNu˙ÎXSâ0;3–¸c¥^krÀ'|‹ÓlYP4Ωî∞˘
p`≥O$ÙYN<v»Ú7õCﬁ‘D@ æçàß0ıﬁÎ´œ†∞«éÑÖ<_IeÒ™ªô/¥—ˇﬁ9ÒË7Ñ$&iä≈‹jtbRmﬂû˘+∂n§áp⁄/Ä≤ãIÙLÎgº∞5y÷`A∏Y¡â¸Hï–îÊªªtö∆≈RïœLn¸?¬“H¥ É.¿Ë`≠fä≥2h∂Z«ÛÁíÉ‚≥N`_ëÿVOÕ∞“+˛9€¢¬Ñ
®›™}	∆aÁ€·%‚Aπ2∫Ï}P«!Ω0∑$ÏÊ
è⁄ˆVnæ≈„Ö˚‚^TÒ˝í˛Å!‡˛‚kÛ«∫ÁÒ´–‚J5…≠/äU;∂£ºZ©¿Ä¶EH»5»∆TÔ‘iGπõb⁄Sà[@VQ‰1EÌœ˝~ RS[j§‰:…ÿ>â%ûIP˘•I’äÂpt}NÓ†*ˆ4Oc‚w’f;£∆⁄o=GæJwE∞¢˜åZë±˚‹Ü™±~Ø∆ìâXGG1ﬁ∑SÊätÕ5°k«§Œp<”≤r2]æU5øBF3AƒQ(B„Ì=
,≈/ˆ]‚©Ä7¯	ÕÌÃ"“Áç£9)Uêaw€úFpÔ'è@«Ï•Ì`ƒÀ¯(„Y,<T_Ø\¢™B‚ÜFo≠›}ÓF•4∂KÓ…áeU ∑M¥≠e⁄ã5¸• xÆj(-
·›Úì.Ω»e≥&¶∑øC-Hm¿‹ŸÒG18é]S‡ù®x ü6Âù¡’Y‘,Ü»êÛ@›˘’3JÕŸ∏µZéÛ.¡É»µÚÖ]Ä∫ª>L4ïb»VÉ’m∂Y-£& ’¶GÙùf∑‡1G;96}˜∞=#€ºÄ~˘ÓÙæ5Y{3;m¢ñ·© \SäÁÕ¯”Õ∆W8#Ÿjv¥˙ﬁP]z|ûcqv¡√A#'öé«	!3ŒøòGB¥ƒZ•∏Ù.À·ﬁ%dÂ¡*r,u>√Úéª »¯—0ù;}â˝=∆4KÑ≤‚ÂgÈWsû≥¸ßùÙ∑-C·; ¿.ıä;´6∞bQ∞Œ’àY˝⁄ˇf≤ˇ[4¥ÛÓ&Â:£mΩøëwn˙Ù©{vòfµ6«ç8	íûwæw%GûçxRxzÂx.qì.gäŸI6CîU≥qé—÷IPíﬁ,Tì∑Å«Ÿ¨‚íànIY¢®îLD_	>O)_w·N5À{ÿAV;ûT≈ıúÃÖ±_h»ÑÿÚ˚Çüªß™@4pçlùyûaßÄ¿qá·fn]ñ£LÀ‚>Vﬁq◊›\´ö4Z∆òúsö∞C¸ƒΩúÍı◊∞¶`vf°˘∆iº÷<‰$·óN¯π›ÿ≤†h{)aÛ‡¿gûHÈ≤ú:xÏëÂn7ÜΩ©àÄ@}0O`4ÎΩ◊WüAaè	x:æí „Uw3^i£ˇΩr„—n	HL“ãπ‘Ëƒ(§⁄ø=ÛVm‹I‡µ^eíÈò◊ŒyajÚ≠¿Çq≤É˘ê+°)Õw,wË58çã§+üò‹(˘~"Ö•êi, \Å—¿[Ãgd–m¥èÁœ.%≈gú¿æ#±¨ûõa•V˝
r∑EÖ	Qª(U˙ç¬œ∑√J≈ÇsduŸ˙†èB{`
oH2ŸÕµÌ¨‹}ã«˜≈º®„˚%˝B¡˝≈÷Áèuœ„W°≈îjì[^™vmGy¥*SÅMäê"ëjëç®ﬂ©&“é 0s27ƒ0µ¶∂Ä¨¢…bä€ü˚¸@§¶∂‘8I…tì,±|J=í†ÛKí´À‡Ë˙ú›ATÌhû∆≈8Ó´ÃvGçµ ﬁzé}îÓäa4EÔ
¥#c˜πUc¸_ç' ∞éébΩo¶2ÕËõjC÷èIù‡x,ße‰d∫}™jÑåfÇâ¢PÑ«€zXã^Ì∫≈·S(nÒõ€8ôD•œGrR™!¬Ó∑9å‡ﬂNÄèŸK€¿âó2ÒP«≤Xx®æ_∏EUÑ≈åﬁ[ª˙›å&Khm0ñ›ì ˛™ oöi˛[  µj˘K@2]‘.P>Z√ªÂ'\·{ë* gLMoÜZê⁄Åπ≥„ébp∫¶¡;Qï?lÀ;É´≤©Xë!,Á>Ä(ªÛ>´4fîõ≥˛qk>¥Á\É6ëkÂ∫uw|òh+ƒë¨´⁄m≤"
Z*GL ´MéÈ;Ão¡bévrl˙ ÔazF∑y¸Û›È}:j≤ˆ*f·v⁄E- √Sï∏¶œõÒßõçÆpF≥‘ÏiıΩ†∫Ù¯=∆‚ÏÉáÇFN5èBfù1é0Ñiâ¥KqÈ\ó√ΩJ»ÀÉ0T‰XÍ|áÂw ëÒ£6`;v&˙"˚zçh0ñ	e≈ÀŒ·
”ÆÊ=g˘O;ÈoZÜ√vïÅ\Î(vWlaƒ¢aù´≤˚µˇÃ2eˇ4 ∂h
iÁ›LÀtG⁄{#Ó‹ıÈ6SˆÏ&1Ãklèp%=Ó}ÓJé=§ÙÀ\‚'\Œ≥ílÜ)™g‚£ ≠:í†%ΩX®'oè≥Y≈%‹í≤EQ)(òàæ|4ûRæÓ√
újóˆ±Ç¨v=®ãÎ9ôcæ–ë	±Â˜?wOUÄh‡ÿ;Ú=¬OÅ‚√Ã‹∫-Gò ó≈|¨Ω‚·Øª∏W5h¥ç19Ê&5aÜ˘â{9’ÎØaM&¿ÏÃCÛç“y≠x…H√/úÒsª±eA–ˆR¬Á(¡ÅŒ=,ê”e9tŸ#À‹n{SÄ˙6"`û¿h◊{ØÆ?Ç¬:t}%ï«™Ófº“Gˇ{‰«£‹êò•* s©—â0PIµzÁ¨⁄πí¡kº .%”1ØùÚ¬‘Â[Å‚e&Û!VC8RõÓXÓ—jpIV?1πPÛ¸DK!“X ∏£Å∂ô*Œ»°⁄iœü\JãŒ9Å}FcY=7¬K¨˚‰oä(¢wP™ı4$ÖüoáîãÊ»Í≥ıAÑˆ¿ﬁêd≥õ(>k€Yπ,˙èÔãyQ«˜J˚ÑÉ˚ã≠œÍü«ÆCã)‘'∂º*U,Ï⁄éÚiT¶ö!D#‘#QøSL•@`Êdnâ`kM"mYEìƒ∑?˜˘ÄIMm©píìË'Xc¯&îz%AÁñ%W*ó¡—ı9ªÇ®€–=çãp›WôÏék@ΩÙ,˙)›¬häﬂ2iF∆Ôs™∆˘æN@&aƒ{ﬁ8Mdõ*—7‘Ü≠í;¡XO …»u˙U‘˛	Ã E†	è∑Ù(∞º€uã√¶P‹„$7∑p3àKü6é‰§UBÖ›4or¡øú>≥ñ∑Å/d„†,è,e∞Q}æqä™	ãΩ∂wıªLñ–⁄`-ª'ï˝U ﬁ5“˝∂@ïk.‘ÛñÄ·d∫©\†|¥(áwÀN∏4√ˆ#TïŒòöﬁ˛¥!µsg«8ƒ‡:uMÉv¢·+~ÿóvWeS∞#BXœ|PwÁ|WhÃ)7g˝‚÷|i:œ∏l#÷ÀuÍÓ¯14–Vâ#YWµ⁄eD¥Téò Wö”vôﬁÉƒÏ‰ÿı@ﬂ¬ÙåoÚ˘Áª”˙t‘eÌTÃ√ÏµäZ@á¶+4qM*ü7„O7]‡åg©Ÿ“Î{AuÈÒzç≈Ÿåúj:$ÑÃ;˛b`	“iñ‚”∏/8á{îëó<`®…∞’¯À:Ó #„Gl¿vÏLı&D˜Ù–`- ãóù√ß]ÕzŒÛûv”ﬁ¥áÏ+∏◊*PÏÆÿ¬âE¬;W"e˜kˇôd ˇh@m–“œªòóËéµˆ˛F›πÎ”l¶ÌŸLbô÷ÿ6‡$Jz›˙›îz6·I·Èó·∏≈N∏ù*g%4ÿRUŒ≈:G@[t%AJ{∞QNﬁg≤ãJ"π%eä¢RP1}$¯h=§}›á9‘/ÌcYÏzQ◊r43∆}°#cÀÔ
~Óû™–¡6±vÂzÖû,≈áôπuZé1@/ã¯0Y{≈√8<_wqÆj–ibrÕLj¬Ûˆr´◊_¬öLÅŸôÜÁ•Ú[ìêá^9„Êwc Ç°Ì§ÖœPÉùzX!ß rË·≥Fóπ‹ˆ¶"ılD¿=Å–Øˆ_]~Ö>t$,·Ë˙J+èU›Ãy•éˇˆ…èGπ$!1KT@.ÊS£`†ík˛ÙœYµs%<É÷yï\Jßb_;Â0Ö©À∂
≈ LÁB¨Üp§7›∞›£‘‡6.í¨~bs†Á˘àñB•∞ qGm3TùëCµ“>ü?∏îùr˙å∆≤znÖñY˜(…ﬁ$PEÓ†UÎhH6?ﬁ)
Õë’gÎÇ>	ÌÅ(Ω!»g7P0|÷∑≤sXı.,ﬂÚ¢èÔî˜	˜[ü>’?è]ÜR©NmyT™XŸµÂ“®M5*BàF©F6¢¶òK:Ä¿Õ»‹¿÷öD⁄≤ä'â*o~ÔÛíö⁄S‡%'—N∞∆ÒL)ÙJÇœ-JÆT/É£ÎrwQ∑°z‡ªÆ3Ÿ06÷Ä{ÈX:ıRª*Ö–ød(“åçﬂÊ4UçÛ}6úÄL ¬::âˆΩpö»7T£n©[>%vÉ·∞ûïìëÍı™©˝2ô@
&äAoÈPa.y∑ÍáM0†π«Hno‡fñ?l…I™Ñªhﬁ‰2É9|>g-o&^»«AXX  a·¢˙}‚U42{mÓÎ8w2ò-°µ¿ZwN<+˚™ Ωj•˚mÄ+÷\©Á-√»uS∏A¯iPÓóúqháÌF®+ù15Ω˝iBkÊŒè:pâ¡tÍöÏE√V¸±/ÏÆ ¶a4FÑ∞ü¯8†Óœ¯Æ–ôRnŒ˚≈≠¯“tüqÿF≠ó,Í’›Òbh°¨F≤Ækµ à(i®1 Æ85:ßÏ3Ωâ:Ÿ…±ÎÄøÖÈﬁÂÛœwßıË© €®ôáŸk¥ÄMVh‚öT?n«ûn6∫¡ŒS≥•◊ˆÇÍ”„Ùã≥
9‘t>H	ôv˝ƒ:¿•&“-≈ßq^pˆ)#/x¿Qìa´Òót› F«éÿÅÏŸòÎLàÔÈ6°¿Z$ï/;8á(O∫õÙùÁ=ÏßΩiŸVqØT†Ÿ]±ÖäÖvÆD Ô÷ˇ3»ïˇ–Ä⁄°(•üw1/—kÌ˝åªs◊ßÿM€≥òƒ3≠±>l¡HîÙªıª):Ùl√í√”/√qãúq;TŒJh±§™ùãtéÄ∂ËJÇîˆa¢úΩ>ŒeîDsJ E§†b"˙HÒ–zI˙ª(r©^€∆
≤ŸÙ¢.Ø‰hf,ç˙CF$∆óﬂ¸›=U°ÉlcÏÀÙ=Xã<3sÍ¥bÄ^Ò`≤ˆãápxæÓ‚]‘°“6ƒ‰õò‘ÖÁ&Ì‰WØæÖ5ò≥3œ6KÂ∂·'!ºr«ÕÓ∆ïC€Iü†;Ù∞BOï‰—√0gå/sπ4ÌMDÎÿàÅz°_Ìæ∫¸
|ËHX√—ıîV™ªôÚKˇÌìésHBb0ñ®Ä\Õ¶G&¿A%÷˝Èü≤kÊJx≠Ú+∏îOƒævÀ`SómãïòœÑY‡InªaªG©¡l\%Y¸ƒÊAœÛ,-ÑKa 8‚é⁄f®;#Ük•|?~q)8.;‰ıçeÙ‹-≤ÔPìΩ*,H†ä›A™◊–êl~ΩR.õ#´Œ◊|€P{BëŒn†`¯≠oeÊ∞Î\>Xø. ÂEﬂ)ÔÔ.∂?|´~∫.§Sú⁄Ú®U∞≥k:À•QöjTÑåSålE˛M1ñtÅõëπ&Å≠5àµeNTﬁ¸ﬂÁ%5µ¶¡JN£úaç„òRÈîüZî]®^G◊‰Ó
¢oCÙ6.¡w]f≥:`l≠ˆ”∞tÎ§wT°*»P•øÕh™Á˙l9ò@ÖttÌ{‡5ën®G‹S∂|JÏ√a=+'#’ÎUS˚$d3ÄLÇ$>ﬁ”†¬\Úo’.ö`Asèê‹ﬁ¡Ã"-~ÿ:ìíU	w–Ω…d˛r¯|ŒZﬁLºëèÇ∞>∞@ï¬√Eı˙≈*™$.hdˆ⁄›◊pÓd1ZCkÅ¥ÓúxV˜U {‘K˜⁄V≠∏SœZáëÍ¶qÇÒ“†›/9‚–€åQV;bj{˚4“Ñ÷Õ0ùt‡ÉË’5Ÿäá¨˘c^Ÿ]ïM¬hå	a?ÒpA›üÒ]°3§‹ù˜ã[Ò•Ë?‚8±å[/X’´ª„ƒ–CY&åe8]÷kïP“Q:b ]pjtOŸf{t≥ìc◊”2ΩÀÁüÓOÎ—Sï∑Q3≥÷*iö¨–≈5®~‹è=‹luÉ2ù¶gKØÌ’ß«È6g<2 r©Ë|ê3Ï˚âtÅ$KL•ZãO‚º‡ÌRF^Å¢'¬W„</Ëª åè±Ÿ≥1◊òﬂ”lCÅ¥H+.^vpPûu7È;œzŸO{“4≥¨‚_®A≥∫c&Ï]àïﬂ≠ˇfë+ˇ°µCPK?Ób^£:÷€˚wÊØO±ö∑g1âf[c|ÿÉê)ÈwÎwRtÈÿá%áß^á‚9‚v®ùî–c4I U;Ëm—î)Ì¬E9{|ù .)àÊîï*äIAƒDıê„°ÙíıwP‰Sº∑çe≥ÈE\_…–ÃXıÜåHç/ø(˘ªz™Cÿ∆ŸóÈz∞xfÊ’i:ƒº.„¿eÌ‡}›≈∫©C•lâ…71©4œL€…Æ_}j1gfülñÀm√NBy‰èõ›ç+
Ü∑í?AvÈaÑû+…£á`Œ^Êsh€öà◊±ÙCæ€}u˘¯—ê∞á£Î)¨>Uw3Âñ:ˇ€'>Êê Ñƒ`-Q∏õMéLÅÇJ≠˚”?e÷Õî[ÂVq)ûâ}Ïó¿¶/⁄(+81ü	≤¡í‹w¬wéSÉÿ∏J≤˘âÕÇüÁ"XZ	ñ¬ p≈µÃQvF÷K¯~¸‚Rp\v…Î2 ÈπZeﬂ†'{TXêAªÇUØ°!ÿ,¸{<§\(7FWùØ
¯$∑†ˆÑ#ù‹A¿Ò[ﬁ Õa◊∏|∞\@Àä>øRﬂ0$ﬂ\m~¯W¸>u\I¶9µÂQ™ag÷tóK¢5‘®	"¶ÿä˝öb-Ë7#sL[jk *ú&®Ω˘øœJjkMÉîúG9¬«1§”)
?¥)∫QºéØ…›EﬁÜÈl\ÉÓ∫Ãgt¿ÿ[ÌßaË◊IÓ® CT˛ë†K26õ–U6œıÿr1ÄËË&€ˆ¡j#‹ Qéπ¶4m¯îŸá¬zVNF´◊™¶˜H»f(ò*H|ΩßAÖ∏Âﬁ´\5¿ÇÊ!πΩÉôDZ¸±t'%™,Ó°{ì»˝‰Ò¯ù¥Ωòy#a|aÄ+ÖáäÎıãTUH\–»ÌµªØ‡›»b¥Ü÷i›9¨Ô™ ˆ©ñÔµ¨[q¶ü¥#’M‚„•A<ª^r≈°∑¢¨vƒ‘ˆ˜h•	≠õ`;>Ë¡&—´j≥YÛ∆º≥8∫+öÖ–¬~„‡Çª?„∫CfIπ;Ô∂„K—~ ≈8pc∂^∞´Ww«â°Ü≤L p∫≠÷+"†•¢tƒ ∫‡‘Ëû≥Ãˆ&Ëg'∆Ø˛ßd{óœ?›û◊£¶+o¢fg≠T“<5Y°ãjQ¸πzπÿÍd;MŒñ_€
´Oè”l.Œ8x(d@ ‰S—¯!$fŸ˜ËHñòK¥û≈y¡<€§åº·8ENÖÆ«x^—w :c≥gbØ1"øßÿÜiêV\ºÏ‡†=Ín”vüÙ≥ûˆ•h<gY≈æQÇgu∆L*Ÿ∫+ø[ˇÃ#VˇCkÜ†ñ~›ƒºGt≠∑˜2ÓÕ_ûc5oŒbÃ∂∆¯±!R”Ó◊Ó§Ë”±JOº≈.r≈ÏQ;)°∆hí@™v.—:⁄£)
R€Öärˆ0¯;ï\RÕ)+TíÇâàÎ!«CÈ%ÎÓ<†…¶yo( g”ä∏æì°ô∞6Îê^PÛwÙUÜ±ç≥/”,Ùa.<ÃÕ´“tây\«Å €.¡·˙ ªãuSÜKÿìnbShüò∑ì]æ˙‘bŒÃ4?ÿ-ó⁄áúÑ<Ú…7ªVo%,~ÇÏ”¬	=VìG¿ù2ºÕÊ–∑5Øc"ÈÜ}∑˙ÍÛ(,Ò£!aG◊RY|™ÓfÀ-tˇ∑N|:Õ!@	â¿Z¢q7öòî[˜ß~ ≠õ)·∂À ¨‚R=˙Ÿ/Å,M^µP.Vpb?e4É%πÓÖÓ¶±qîeÛõ?œD∞¥-Ö ‡ã0:kô¢Ïå≠ñÒ¸˘≈§‡∏Ïì◊d6ï”s,¥ øANˆ®∞!Ç*w™_CB±X˘ˆxI∏PnåÆ;_ÒHoAÌ	F;πÇÅ„∂Ωïõ¬Øq¯a˛∏Äó|§ø`H8ø∏⁄¸ÒÆ˘|Í4∏íMrkÀ¢U¬Œ≠Ë/ñEj0 ©QD2M2±˚5ƒZ—nFÊò∂‘"÷ïT9LQ{Ûüî‘÷ö)9érÖ6èbIßR~iRu¢y_ìª(äΩ”ÿ∏›uôŒËÅ±∂€O¬—Øí›Q,@Ü®˝#Añdl˛7°™lüÎ±‰b——L∑ÌÉ‘Fπ@¢sMh⁄Ò)≥ÖÙ¨úåWØUMÔêëÃP1T
ê¯{OÇqÀΩW∏<jÅ Õ>Bs{3à¥˘cËNJU$X›Cˆ'ë˚…„Ò;i{1ÚF>
¬¯¬V◊Î®™ê∏°ë€kw_¡ªëƒi≠“ªr·YﬂU ÌS-ﬂkY∂‚M?iF´ö≈
«KÇxwº‰ãC<o2EYÏâ©ÌÔ–K[07¿v|—ÉL£W‘8g*≤ÁçygpuV5°2$Ö¸«¡w~«uÜÃísvﬂ.m«ñ£¸@ãp‡∆2mºaW ÆÓèCeò2ï‡u[≠VDAKEËâ u¡©—=gôÌ8L—ŒNç_˝,O»ˆ/ ü~ª=ØGMVﬁEÃ<Œ[®•xj≤C‘¢˘s>Ùs±’»vöù-æ∑Wûßÿ\ùpP»Ä@…¶£ÒBHÃ≥Ô&—ê-1ñi.=ãÚÉx∑Iy√päú]èº£Ó 2>t∆gŒƒ_bDO±“!¨∏yŸ¡<Az’‹ßÏ?Èg=ÌK–xŒ≤0ã}¢ŒÍç,òT,≥u"V∂ˇôF¨ˇÜ÷A-¸ªâyéË[oÔd›õæ=∆jﬁùƒ&ômçÒcB§ß›Ø›I—ßcîûyã\‰ãŸ¢vRCç–%ÄUÏ\£tµGR§∑‰Ì`Òv+∏§"õRV®*%◊BèÜ”J◊›xAìMÚﬁ6PïŒßq}'C3al◊2!6º˛†ÁÓÈ™cg^ßXÈ ¬0\·xôõW•ËÚ∏èï∑\<É√ı@wÍ¶ñ±&'‹ƒ¶,–?1o'∫}ı,©ƒùôh~±Z/µ9	xÂì>nw6¨(ﬁJX¸80ŸßÖz¨'éÅ;dyõÕ°oj" _∆D”˙oı’ÁPX„GB¬éØ§≤¯U›ÃóZËˇoú¯tõBÄÅ¥E‚n5:1
)∂ÔO¸ï[7R√8mó@Y≈§z&ı≥^Xöºk0†\¨‡ƒ~$ hJs››:Mc‚) Á&7
~üàai$Z ¡`t0÷3EŸ4[-„˘ÛãI¡qŸ'0Ø»l+ßÊXiïÇúÌQaBTÓ
UæÜÑc∞ÛÌíq†‹]væ(„êﬁÇ€åvs«m{+7Ö_‚Ò¬˝q/*¯˛I¿êpqµ˘„]Û¯’hq%ö‰÷óE™Öù[—^-ä‘`@S¢$àdödc*˜jâ¥£‹åÕ1m©D≠ +®rò¢ˆÁ˛?)©≠5Rr‰lƒíO§(¸“§ÍEÚ8:æ'wP{ß±qªÍ3ù—cm∑ûÖ£_%ª¢XÄQ˚FÇ-»ÿ˝nCUÿ?◊c…ƒ,££òo€©åsÄE:Êö–µ„Rg8ÈY9Æ_™öﬂ!#ô†b®!Òˆû‚ó{Æqx‘
@õ|ÑÊˆfiÛ∆—úî™H∞ªÜÌN#8˜ì« „v“ˆ0bÂå|ÖÒÖ¨*Ø◊.QU!qC#∑÷ÓæÉw#â“[•w‰√≤ø™ €¶Zø÷≤m≈ö~“<åW5ãèñÓy…Üxﬁdä≤ŸS€ﬂ°ñ$∂`nÅÏ¯£òGÆ©pŒT<eœÚŒ‡Í¨jCdH˘èÉ 
Ó¸èÍô%ÊÏø\⁄è-G˘Ä‡¡çdÜ=Qø¢"‡ŸyÂ5Œõ‘>I§Sw}iu.Ïˇ|¨\Ö1Ã$èg\bc‰A˜ßan°ø¿àÖ†qeSBufábIÆ¥˜+öy—V∫ÉúT„n ƒ•Çê◊Q¬¡∞NGƒ_n˛l≤∏{ofò ≥\Ûﬁ•ù“-£ÖË¯êmÕxÛÍ∆ÈE‡Ü∏"ˇõÉrÁ1bvA;waúÂÛZΩ¶éL|á}TF∞&Å,1Ö$i^böüË∫ıb*‰ßŒWßòªSí Ãs¶ Ú˜RÂ}•àÏ‚.I! 7D»ÇÖr+Bƒv≥Ã%‰9„{∂∞D†Dm\∞9√÷√¬√ËG6ËL∫[y‰^µ˛U&G∏˜îq[◊∂êÈ’6$?©é∂ª»[SÆ´µıŸ›P{‡ÚXkPD}ÿeBì_‘b∞’±yô='PÀõΩìÜæ0",™ﬂÂ«9…1C∞O,øzüG<Ã»Q¥.Ÿ˜é‡˘‘êGá¯x—*≤Â“ú≥±Fv≤ß^Åù!±äß¨vœƒÃ/úK°î·çÌ4ÿÉ#ì¶ØÀBkOıèüL∞Ù€¶±‚√¸â7»dº!+ªøﬂArwÁXœÂ
!T0_O8q{z√‚†∂öUDf–K. !∆»{˛€Ÿ¸ñu˜:#ïãùÛÎ≠í a‘Ië[xè%–Mt∂≥òC˘O Ü)üæG¶>v∑j/ÒkDÈDãe„9:≠j0≥ëÎ¿Ó=-∑KÈˇ|—?üRôuLÕóI•8Ëm|L±ü†n'©∞2O-‘˙∆$]={ıW"ÎUÇÚˆ9û$⁄æFÕEÇØ8ﬁBœ˙H€Êı˘p%	©ëÙA:z˝°´m~ﬁî8ET/µ 6R–u™ÙƒI\C•ÍV?Y∫∑Ó7 79´+Ïñ∏ÔÁFÊdùÁ%¨w§ø©ÆŒ∫0Åﬂ≠¨§ï„[≈6È'¡v⁄a∂ØZ∂*uèãÇ±_’	À∞ú„à*ôƒ\˘9%Ôê¬Ù∏Aµà∫O˛Â]s˙•nN#yUNÅP9lÔv˚ß∏∏Œ!HÒ¨Ê˛uã2 ^î8[1è√È,MçÕ¢A™ @ΩπÃ˜æ;Æ◊Ω¬ı”:–	¢V˘Î»ˆ2„3›-r\∆÷™oûàÚ$cπèÿpø8Zü;4Ê◊ÙÙ˚¶”√´†P£]UΩyπêR"Ç¯πÏZÀIÁ¥6xöÄ™ˇH≤KÄRÔö%t ZﬂáÊQïË◊‡“ı"l—ÚB7ÍöLŸYH@º“∑í?#¸&∏ÒŒ«q¢¨bWá5`…b>*¶+”y7oÈ‡¯øÎ"‡*ÂÃµ2&ÄGJ‡•q˛—>|‰7z¢ED¡≥ÚÀjù7©|*íI¶Ó˙“Í\Ÿˇ*¯Y∏bôHŒ∏ƒ∆…ÇÔO¬‹$CÅA‚ ¶ÑÍÃƒí]iÔV5Ú£¨u2,29®«‹&ïâK!Ø¢ÖÉaúéâ><æ‹˝˛ÿeq8ˆﬁÃ1@g∏ÁΩK;•ZG—4Ò!⁄õ>Á’ç”ä¡<qDˇ7.‰œbƒÏÇvÓ¬9ÀÁ¥{Mò¯˙®åaLXbH“ºƒ5?—
uÎƒT…OùÆO1*w¶% ôÊM ÂÔ§À˙KŸ≈\íB@nàë‰VÑâÏgôJ…8r«ˆmaàAà⁄∏ará≠áÖá—él—òu&∂Ú…ºk˝™Léq.Ô)‚∂Øm!”´lH~8&Smwë∂¶]WkÎ≥ª†ˆ¡Â∞÷†à˙± 4Ñ'æ©ƒa´:
cÚ3zN†ó7{'}`DXUøÀèrìbÜaûXÙ?éxôë¢i\≥Ô4¡Û©!éÒ(˛"£TeÀ•9gcåÏeOº;Bc
(OYÏüâô^9ñC)√€h±F"'M_óÑ÷ûÎ?òaÈ∑Mc≈á˘në»yBVwøÇ‰Óœ∞üÀB(®`æûp‚ˆÙá≈Am5™àÃ°ñ\ Bç.ëˆ˝∑≥˘-ÍÔtF+;Á◊[%@¬©í#∂J°˛öËmg(1ÜÛûïR?}éM|Ïo‘^„÷2à”à «rt[‘`g#◊Å›zZoñ”ˇ¯£~.?§3Íòõ/íKp0—⁄¯:òc?A‹NSadûZ©ıçH∫zˆÎÆD◊™ÂÌr=0H<µ:}åõä&_pΩÑüıê∑Õ&2ÎÛ‡JS#ÈÇt8Ù:˚CW⁄¸Ω>:)pä0®^:kïl§°ÍUÈâí∏ÜK’¨~˛≤uo›nïnrW VŸ-qﬂœåÕ»;œJYÓIS]6ùu$`ø[YI+«∂6ãl”NÉÏµ¬m_¥mTÍ4c"æ´óa9:«T3â∏ÛrJﬂ!ÖÈqÇkuû˝À∫ÊıK‹úFÚ™ú†rÿﬂÏ˜OqqùBê„YÕ2˝Ídïº)p∂bá”XöõEÇUïÄ{sôÔ}v]Ø{8$ÖÎßt°E:¨Û◊˛ëÌd$«fªZ0‰∏ç≠Uﬁ=ÂH∆s ±‡p&¥$?vhÕØÈ8È˜MßáWA†G∫™{:Ús!§DÒ"sŸ¥óíœi"l5Uˇêeñ§ﬂ5JËï¥øÕ¢+—Ø¡•Î<Dÿ£ÂÑn’5ò≥≤êÄy•o%~F˘Lq„ùè‚EY>ƒÆj¿ì4ƒ|TMVßÚnﬁ”¡Ò◊D¡TÀôkdLéî¡K‚˝£|¯…n0ÙE˛äàÉgÂó‘;nS¯T%íM›ı•’∏≥ˇTÒ≤qƒ3ê>ùqâçìﬂûÖπHÜ˛"Ç≈ïM	’ôâ%∫“ﬂ<¨jÂGYÍ0dXdrQèπL+ñ
B_E¬9|x}π˚˝± ‚pÌΩôbÄŒqœ{ñvK¥é£h„<Bµ74·|œ´ßÉx‚àˇn\…üƒâŸÏ›Öróœiˆö:41Òı,Q¬ò∞ƒê•y<âj~£Í◊â®ìû;]ûbTÓMJ 3Õö ÀﬂIóıñ"≥4ã∏%ÑÄ‹#
…¨	ŸŒ3îìp‰èÌ⁄¬Çµq¬‰[4£ÿ£1ÍLmÂìy÷˚Uò‚\ﬂR≈m_⁄BßWÿê¸pL¶:⁄Ó#mM∫Æ÷◊gwAÌÉÀa≠A<ıcïh	N}Sâ¬Wt∆ÂfÙúA/nˆN˙¿à∞™ó‰'ƒ¬=∞˛È~<3#E“∏gﬂh:ÉÁSB„·P˝DG® óKrŒ∆Ÿ ûyvÑ∆*Pû≤Ÿ?3ºr-ÜRá6∑<–cåDNöæ/	≠=◊>~1¬”o,ö∆ãÛ&‹4#ëÚÑ¨Ó˛…›üa?ó(ÑPQ¿}=‡≈ÌÈãÇ⁄j8UôC-∏ Ñ8\#Ì˚ogÛZ’ﬂËåV.vœØ∂JÄÖS%Fm·>îC˝5—⁄,ŒPbÁ=+§~˙ö¯Ÿﬁ©º«≠dß.ïè‰Ë∂©¿ŒFØªÙ¥ﬁ-ßˇÒG¸\~If’17^%ñ‡0`£µÒt1∆~Çπú¶¬»=¥SÎêuÙÌ◊]àØU
À€‰z`êxkt˙7L
æ‡{	?Î!oõLd◊Á¡î$¶F”ËpÈt˜ÜÆ8µ˘{|tR0‡`8Qºt÷+ÿIC’™”%qñ´Y¸˝eÍﬁª‹+‹‰Æ@¨≥Z‚øüõëvüî≤›í˛¶∫l;ÍH¿∂≤íVèmlÿßúŸkÖ⁄æi⁄®’h>.
∆D}W$/¬rtè"®fqÁ‰îøB”‚÷"Í=˚óu ÕÎñπ9åÂU9A‰±øŸÔû‚‚;Ñ!«≤õd˚’.»+yR‡mƒ>ß∞567ä™+ˆÊ3ﬂ˙Ï∫_ˆpH◊OËC$ät<YÁØ˝#€»HèÃw¥`…q[™Ωz"ÀêçÊ>@c¡˛‡LiH~Ï–õ_”p”ÔöOÆÇAéuUˆtÂÊBIà
„DÊ≥i/%ü“Dÿ·j™ˇ! -Iøjî—+iõEV£_ÉK◊xà4±GÀ<	‹´j1ge!ÚKﬁJ¸åÛò8‚«;≈ä≤|â]‘Å'hâ¯®ö¨OÂ‹Ωß0É„˛ØàÉ®ó3÷»ò)Éñ≈0˚G¯Òì‹`4Èä˝ŒÀ/©v‹¶Ò®J%öªÎK´qgˇ®„e‚,âf!|;‚'
ø =sê˝D,ã+ö´3<Ju•øxY‘Àé≤’`»∞»‰¢sòV&-ÑæäÖr:&¯˙s˜˚cï≈‡€{3ƒù‚üˆ-Ïñi,G–«xÑknh√¯üW6O*4≈ˇ‹∏ì?â≥
Ÿª‰/ü“Ì5thb„<ÎX¢2Ö1aâ,!KÚx‘¸G(’ØQ'=v∫=ƒ®›öî fõ5 óøí/Î-0DghqJ	π"F,ìY&≥ùf)'‡…€µÖ""k‚Ö…∂hG:±Gb’ò⁄À'Ú≠˜™1:≈∏ø§ã⁄æµÑOÆ±!˘‡òMtµ›F⁄öu]≠ØŒÓÇ€ó¬[Ç"xÎ∆+–ú˙¶ÖÆË(çÀÃÈ9Ç^‹Ìú4ıÅaU˛/>…NâÖza˝”¸:·xfFä•qŒø–tœ¶Ñ:<«√†˚àéQï/ñ‰ùç2≥ï=ÚÏ	çT(†=e≥~&fy‰Z§lox°∆àú5}^[z0Ø|¸bÖßﬁX5çÁLπhF#Â	Y›˝˛
ìª?¬~/P	†¢Å˙z¡ã€”µ‘p™"3ÜZq 	6p∏F€˜ﬁŒÁ¥´ø—¨\Ïü_mî0¶Jå⁄√|)Ü˚j£µXù†ƒœzV4I¸ı:5Ò≥ΩSyè[»"O"\+…—mSÅùå_wÈiΩZOˇ„é˘∏¸íÃ´bnºJ-¡`¿Gk„Ëbç¸s9MÖëzi¶◊6!ÍÈ€Ø∫_™ó∑…Ù¿!÷Ëı2n*ò}¡ˆ~◊Bﬁ7ò»ØœÉ)HMåß
—‡” ËÔ]pkÛˆ¯Ë§`¡*¿p¢yË≠V±íÜ´Uß&J‚-W≤˘˚ ’ΩwπVπ…]ÄYg¥≈?27#Ï?)eª%˝Muÿv’êÅ˛me%¨⁄ÿ.±O9≥÷µ}0“µQ´–|\çà˙ÆH^Ö‰ËDQÃ&‚œ…)Ñß≈
≠D’z˜/Í@õ◊-sr À™rÇ…c≥ﬂ=≈≈v	Bèe7»˜´\ëVÚ§¡⁄â|Oajln
UVÌÕføıŸuæÌ‡êØû—ÜHËx≤œ_˚F8∑ëêôÓi¿ì‚6∂U{ÙDó!Õ|Ä∆É˝¡ò“ê¸Ÿ°78æß‡ßﬂ5û]ÇÍ™ÌËÀÕÑí«àÕg“^J?•à±√‘UˇBïZí‘)£V“˛<7ä¨GæñØhcéóxπW‘bŒ BÂñΩî˘Á1p≈èv>ãe¯∫<©N–ÒQ5YûÀπ{O`«˝_0Q/f≠ë1:R-ã`˜éÒ„'π¿h”˚*"ùó^SÏπM„QîJ5w◊ñW‚ŒˇQ« ≈XÃB¯v≈&6N@zÊ!˚0àX
V5$Wfx&îÍK≤©óe´¿ë8aë…E>Ê1¨LZ(	},‰tLÒ·ıÊÔ˜∆+ã¡∑ˆfâ;≈?ÌZŸ-“:Xé°è	÷‹–áÒ?ÆlûT·hã"ˇπ8q'~&g≥w…^?•€jË–ƒ«x◊∞Edb¬XBñÂ&©˘éP´_&¢NzÏuzâQª5) Ã7j /%^◊Z`àŒ–.‚îsDå(X'≤$Lg;ÃRN¡ì>∑kD
D÷≈ì<m<,–<étcéƒ´1µóNÂ[ÔUbtãqIµ}k	û]cBÛ¡1öËkªåµ5Í∫[_ù›∑/Ö∂D◊çV°$9ıM&]—Póô”rºπ€9h Î"¬™˝^|ìú4Ù¬˚ß˘t√ÃåK‚ù°ËüM	txèáA˜¢+^-…;dg+zÂŸ®PAz g¸LÃÚ0…¥IÿﬁCç829j˙º$∂Ù`_¯˘ƒOΩ∞j.<œòs–åFÀ≤ª˚˝'w~Ö¸^†AEıÙÉ∑ß<.
k©‡UDf¥‚ l‡qå∑ÔΩùœiW£2Y∏Ÿ?æ⁄)`Mîµá¯R˜‘Gk∞;Aâ4üÙ¨hí˘Îtj„g0{¶Ú∂ëDûD∏V>ì£⁄¶;æ0Ó”“{¥ûˇ«Ûq˘%ôWƒ‹yîZÉ¿Åé÷«—ƒ˘
Êrö#Ù“MØlB’”∑_u"æU(/oìÈÅB·≠—Îd‹T1(˙ÉÌ$¸ØÑΩn1ë_üRêöO£¡ß@—ﬂ∫‡ ÷ÁÌÒ—I¿ÉTÅ‡EÚ—[¨c%W™OLî≈4ZÆeÛ˜ï´{Ós¨sì∫≤Œiã˛~dnFŸ~R wJ˚öÍ±Ï´! ˝⁄ JY>µ±\cûrg≠k˙`•k¢W°¯∏(ı]êº…—>à¢ôL≈üìR˛	,Oã[à´ÙÔ^’Ä7ØZÊ‰@2óU‰ì∆˛gøzããÏÑ nëÔW∏#¨ÂIÉµ¯<û¬‘ÿ‹*™¨€õÃÎ≥Í}€¡!,_=£ê*—eüæ˜åpo#!>3›“Å'≈lm™ˆÈà/B6õ¯ç˚É1•!˘≥Cnp}O¡Oøj=<∫
:’U€—óõ	%"(èõŒ•ºî~Kcá©™ˇÑ+¥%˛©RG¨0•˝xnYé}-_·"–∆/$sÆ©ƒùïÑÀ-{)Û2œb‡ãÏ|* Ò&uxSú°&„¢j≤=ósˆû¿è˚æ"`¢^Ã[#bt§Z¿Ô„«NsÅ–ß*˜TD;/º¶Ÿsö«¢)îjÓØ-Æ≈ùˇ¢èïã∞&ôÑÒÏãLlú(˛ÄÙ,ÕB4˜`∞.¨jHÆÃL)’ñ˛·eS/: WÅ#p¬#ìä|ÕbYò¥P˙*X8…Ëò„√ÎÕﬂÔçVÉoÌÃvã~€¥≥Z•t∞C·≠π°„~]ÿ=®√–Dˇsp‚N¸&LŒ(gÓ ,ìº~K∑‘—°âèØaä»ƒ0Ö&∞Ñ-À·LSÛ†WæLEúÙŸÍÙ¢wj R ôn‘ ^˛JºØ¥¿ù°\≈)$ÊàP∞NeHòŒvô§úÉ'|o÷àà≠ã'x⁄xX°xË∆âWbk/úÀ∂ﬂ™ƒË‚˛í.k˙÷=∫∆ÑÁÉb5—÷wkj’u∂æ;ª
o^m
à·Ø¨CHrÎöL∫£†6/3ß‰
ys∑r–@◊DÖU˚º¯'9&hÈÖ˜OÛËá·ô*ñ≈;˛C—?öËÇÔ":EVºZìv6»ŒVÙÀ0≥$6Q†ÇÙïŒ˘òôÂ`ìi4í<±Ω·Üpd"r‘ıyHmÈ¿æÒÛâû{a‘6\xü1Ê°åó$ew˜˚(NÓ¸˘ºA$ÇäÎÈ.oOx\÷S¡™àÃi≈ $ÿ¡‚oﬂ{;ü“Æ˛Gd≤q≥~}µR,¿ö)2kÒ§Ô©é÷avÇh?ÈY–%Û◊Ë‘«Œ`ˆMÂ>m#à=àq¨|'GµMv2}`›ß•ˆi=ˇè:Á‚ÛJ3ÆâπÚ)¥Å≠è£â6ÛÕ‰5FÈ•ö _ÿÑ´ßoæÍD}™P^ﬁ'”Ñ√[£◊»π®bPı€H˘_	{‹b#æ?§!52û(GÉOÄ£ø4u¡@≠ œ€„ £íÅ®¡äÂ£∂Y∆JÆUûò)ãh¥] ÁÔ+Wˆ›ÊYÊ'ueù“˝¸»‹å≥¸§ïÓî˜5’cŸWB@0˚µïî≤|kc∏∆=‰8Œ[,÷ı¿K÷EÆCÒqP6"Î∫!yì£|E3òã?'§˝Xû(∂WÈﬂº´n_¥Õ…Äd/™…0
'ç˝ŒÙŸ$	>ï‹#ﬂÆqFYÀík&Òx=Ö©±πT(UY∑7ô˛◊g’˙∑ÉBXæzG!T£· ?}Ô‡ﬁFB|fª•Nãÿ⁄UÌ”^Ñl7Ò˜bKBÛgÜ‹‡˙ûÉû‘zxu
t´™∑£/7JDP"7ùKy)¸ñ"∆SUˇ	ViJ˝S§éY`K˚‹*≤˙Zæ√D°ç:^·HÊ]Sâ;+	óZˆRÁdüƒ¡>Ÿ¯.Tï„LÍ¶9CL«E‘ez/ÊÌ=Å˜}D¿Eºô∂FƒËI¥.Åﬂ:«èúÊ°OTÔ®à8v^yM≥Ê5èER)‘›_Z]ã;ˇE+aL3	„Ÿòÿ9P˝ÈXõÑhÔ0¿"a(\Y‘ê]ô·òR´-˝√ ¶^tïÆF‡ÖF'¯õƒ≤1i†$ıT∞p,ì—1«á◊õøﬂ¨.ﬁ€ô&Ï¸∑ig¥KËa:Ü>√$[sC«¸∫±zQ8á°.àˇÊ‡≈ú˘LòùPŒ›@X'y¸ño©£C·_¬ë,â`La	Zó√ò¶Á:AÆ}òä9È≥’È&EÓ‘@§ 3‹© º˝îy_iÅ";C∏ãRHÕ2†aú ê1ùÏ3I9N¯ﬁ≠,([,Nµ∞C:—ç:Æƒ÷^9ómøUâ—.≈˝%\÷ı≠$zuç	œƒj£≠Ó2÷‘´Ím}vwﬁ8º⁄√_6YÜê‰◊5ò,uGAl^fO…ÚÊo‰°ÄØà™˜yÒNrL–,”ÔûÁ—√32T-ãv˝Ü£8~5$—·>ﬂDtä¨y¥'Ïlëù¨Èó`gHl¢AÈ+ùÛ13À¿'“h%xc{√6‡»D‰©ÎÚê⁄”Å}„Á,=ˆ¬©l∏?bÕC2/H ÓÔ˜Pú›˘ÛyÇH◊”\ﬁû∏(≠¶ÉUô4“ã H±É≈2ﬁøˆv?•]˝é»e‚g¸˙k§XÅ5Rd÷„I4ﬂS≠¬Ï&–~”≤°JÁØ—©èù¿ÌöÀ|⁄Fz‚Y¯NéköÏd˙¿0ªOKÌ“zˇtœ≈Áîf]sÂRi:[GlÁ(õ…j,å”K5@æ±	WOﬁ}’à˙U†ºΩNß	á∂GØësQƒ†Î∑êÛæˆπƒF}~IBjd=PéûGhÍÉÄ[@ü∑«@G%QÉÀGm≤çî4]™=1R–i∫ïœﬂVÆÌªÕ≤ÕNÍ ;•.˚˘ëπg˘I+›)Ôj´∆≥ÆÑÄ`˜k+)e¯÷∆qçz…pù∂X≠ÎÅñ≠ä]Ü„‚†lD◊uBÚ,'G¯"äf1~NI˚$∞=.Pm"Æ”øyW‹æiõì»^Uì`N˚ù˛È..≥H|+πFø]‚å≤ó%÷L„zScs®P™≤on3˝ØŒ´ıoÑ∞}Ùé4B®G√ï~˙ﬂ2¡ΩåÑ¯ÃwKú±µ™€ß"º	ÿn„6ÔƒñÑÁŒπ¡ı==˛©ÙÍ(ËWUoG^n$îà†>Dn;ñÚR˘-Dç¶ ™ˇ¨“ î˚¶I≤¿ñ˜·πTe:ı8¥}áàCtº√êÕ∫¶vV/¥Ì§œ»?âÉ.|≥Ò\®+«ò’·MrÜòèä© Ù^Õ€z8>Ô˙àÅ8äy3måâ —í8i\øtè9ÕCû®ﬂQpÏºÚögÕjä§R©ªæ¥∫vˇä>V.¬òf«≥.1±r†˚”∞7	–ﬂ`ÅD¬P∏≤©!∫3√1§WZ˚áïMºË+]å¡åN*Ò7âeb“AHÎ®a‡X'£bèØ7ø6Y\Ω∑3LŸ.˘o“Œiñ—¬t|áH∂ÊÜ<è˘ucÙ¢pC\ˇÕ¡ã9Ûò1;†ùªÄ∞NÚ˘-ﬁSGÜ&>√æÖ*#X¿ò¬¥/á1MœtÇ]˙1r”g´”Lä›©ÄI fπS y˚)Úæ“DvÜq§êõ"dA¬9ï!b;ŸfírúÒΩ[X"P"∂.Xú·k·aÜ·t£t&]â≠ºr/⁄™£\ã˚J∏≠Î[HÙÍüâ‘G[›d≠©W’⁄˙ÏÓ(Ωpy,µ("áæl≤!…Øj1XÍéÇÿºÃûì(ÂÕﬁ…C_UÔÚ„ú‰ò°Xßﬂ=œ£áfd®ZÏ˚Gp¸jH£√|<
øàËYÚiNŸÿ#;Y”/¿ŒêÿEÇ
”V;ÁbfóÅN•–J∆ˆál¡ëà…S◊Â!µß˙«œ&XzÌÖSÿq·~ƒõÜd2^êï›ﬂÔ†9ªÛ,ÁÚê
*Øß∏Ω=·qP[M™"3h• êcãdΩÌÏ~K∫˚ë ≈Œ˘ı÷I∞j§»≠<«íhø¶ginalChildRect = Spry.Effect.getDimensionsRegardlessOfDisplayState(this.firstChildElement, this.element);

	if (fromPos.units != toPos.units)
		Spry.Effect.Utils.showError('Spry.Effect.MoveSlide: Conflicting units (' + fromPos.units + ', ' + toPos.units + ')');
		
	this.units = fromPos.units;

	var originalRect = Spry.Effect.getDimensionsRegardlessOfDisplayState(element);
	this.startHeight = originalRect.height;

	this.startX = Number(fromPos.x);
	this.stopX = Number(toPos.x);
	this.startY = Number(fromPos.y);
	this.stopY = Number(toPos.y);

	this.rangeMoveX = this.startX - this.stopX;
	this.rangeMoveY = this.startY - this.stopY;

	this.enforceVisible = Spry.Effect.isInvisible(this.element);
};

Spry.Effect.MoveSlide.prototype = new Spry.Effect.Animator();
Spry.Effect.MoveSlide.prototype.constructor = Spry.Effect.MoveSlide;

Spry.Effect.MoveSlide.prototype.animate = function(position)
{
    if(this.horizontal)
    {
	    var xStart      = (this.direction == Spry.forwards) ? this.startX : this.stopX;
	    var xStop       = (this.direction == Spry.forwards) ? this.stopX : this.startX;
	    var eltWidth    = xStart + position * (xStop - xStart);

	    if(eltWidth<0) eltWidth = 0;

	    if(this.overflow != 'scroll' || eltWidth > this.originalChildRect.width)
		    this.firstChildElement.style.left = eltWidth - this.originalChildRect.width + this.units;

	    this.element.style.width = eltWidth + this.units;
    }
    else
    {
		var yStart      = (this.direction == Spry.forwards) ? this.startY : this.stopY;
		var yStop       = (this.direction == Spry.forwards) ? this.stopY : this.startY;
		var eltHeight   = yStart + position * (yStop - yStart);
	
		if(eltHeight<0) eltHeight = 0;
	
		if(this.overflow != 'scroll' || eltHeight > this.originalChildRect.height)
			this.firstChildElement.style.top = eltHeight - this.originalChildRect.height + this.units;

		this.element.style.height = eltHeight + this.units;
	}
	
	if(this.enforceVisible)
	{
		Spry.Effect.enforceVisible(this.element);
		this.enforceVisible = false;
	}
};

Spry.Effect.MoveSlide.prototype.prepareStart = function() 
{
	if (this.dynamicFromPos == true)
	{
		var fromPos = Spry.Effect.getPosition(this.element);
		this.startX = fromPos.x;
		this.startY = fromPos.y;
		
		this.rangeMoveX = this.startX - this.stopX;
		this.rangeMoveY= this.startY - this.stopY;
	}
};

//////////////////////////////////////////////////////////////////////
//
// Spry.Effect.Size
//
//////////////////////////////////////////////////////////////////////

Spry.Effect.Size = function(element, fromRect, toRect, options)
{
	this.dynamicFromRect = false;
	if (arguments.length == 3)
	{
		options = toRect;
		toRect = fromRect;
		fromRect = Spry.Effect.getDimensionsRegardlessOfDisplayState(element);
		this.dynamicFromRect = true;
	}
	
	Spry.Effect.Animator.call(this, options);
	
	this.name = 'Size';
	this.element = Spry.Effect.getElement(element);

	if (fromRect.units != toRect.units)
		Spry.Effect.Utils.showError('Spry.Effect.Size: Conflicting units (' + fromRect.units + ', ' + toRect.units + ')');
		
	this.units = fromRect.units;

	var originalRect = Spry.Effect.getDimensionsRegardlessOfDisplayState(element);
	this.originalWidth = originalRect.width;

	this.startWidth = fromRect.width;
	this.startHeight = fromRect.height;
	this.stopWidth = toRect.width;
	this.stopHeight = toRect.height;
	this.childImages = new Array();

	if(this.options.scaleContent)
		Spry.Effect.Utils.fetchChildImages(element, this.childImages);

	this.fontFactor = 1.0;
	if(this.element.style && this.element.style.fontSize)
	{
		if(/em\s*$/.test(this.element.style.fontSize))
			this.fontFactor = parseFloat(this.element.style.fontSize);
	}

	if (Spry.Effect.Utils.isPercentValue(this.startWidth))
	{
		var startWidthPercent = Spry.Effect.Utils.getPercentValue(this.startWidth);
		//var originalRect = Spry.Effect.getDimensions(element);
		this.startWidth = originalRect.width * (startWidthPercent / 100);
	}

	if (Spry.Effect.Utils.isPercentValue(this.startHeight))
	{
		var startHeightPercent = Spry.Effect.Utils.getPercentValue(this.startHeight);
		//var originalRect = Spry.Effect.getDimensions(element);
		this.startHeight = originalRect.height * (startHeightPercent / 100);
	}

	if (Spry.Effect.Utils.isPercentValue(this.stopWidth))
	{
		var stopWidthPercent = Spry.Effect.Utils.getPercentValue(this.stopWidth);
		var originalRect = Spry.Effect.getDimensionsRegardlessOfDisplayState(element);
		this.stopWidth = originalRect.width * (stopWidthPercent / 100);
	}

	if (Spry.Effect.Utils.isPercentValue(this.stopHeight))
	{
		var stopHeightPercent = Spry.Effect.Utils.getPercentValue(this.stopHeight);
		var originalRect = Spry.Effect.getDimensionsRegardlessOfDisplayState(element);
		this.stopHeight = originalRect.height * (stopHeightPercent / 100);
	}

	this.widthRange = this.startWidth - this.stopWidth;
	this.heightRange = this.startHeight - this.stopHeight;

	this.enforceVisible = Spry.Effect.isInvisible(this.element);
};

Spry.Effect.Size.prototype = new Spry.Effect.Animator();
Spry.Effect.Size.prototype.constructor = Spry.Effect.Size;

Spry.Effect.Size.prototype.animate = function(position)
{
	var width = 0;
	var height = 0;
	var fontSize = 0;

	if (this.direction == Spry.forwards) {
		width = this.startWidth - (this.widthRange * position);
		height = this.startHeight - (this.heightRange * position);
		fontSize = this.fontFactor*(this.startWidth + position*(this.stopWidth - this.startWidth))/this.originalWidth;
	} else if (this.direction == Spry.backwards) {
		width = this.widthRange * position + this.stopWidth;
		height = this.heightRange * position + this.stopHeight;
		fontSize = this.fontFactor*(this.stopWidth + position*(this.startWidth - this.stopWidth))/this.originalWidth;
	}
	if (this.options.scaleContent == true)
		this.element.style.fontSize = fontSize + 'em';

	//Spry.Debug.trace(fontSize);

	this.element.style.width = width + this.units;
	this.element.style.height = height + this.units;

	if(this.options.scaleContent)
	{
		var propFactor = (this.direction == Spry.forwards) ? (this.startWidth + position*(this.stopWidth - this.startWidth))/this.originalWidth
														   : (this.stopWidth + position*(this.startWidth - this.stopWidth))/this.originalWidth;

		for(var i=0; i < this.childImages.length; i++)
		{
			this.childImages[i][0].style.width = propFactor * this.childImages[i][1] + this.units;
			this.childImages[i][0].style.height = propFactor * this.childImages[i][2] + this.units;
		}
	}

	if(this.enforceVisible)
	{
		Spry.Effect.enforceVisible(this.element);
		this.enforceVisible = false;
	}
};

Spry.Effect.Size.prototype.prepareStart = function() 
{
	if (this.dynamicFromRect == true)
	{
		var fromRect = Spry.Effect.getDimensions(element);
		this.startWidth = fromRect.width;
		this.startHeight = fromRect.height;
	
		this.widthRange = this.startWidth - this.stopWidth;
		this.heightRange = this.startHeight - this.stopHeight;
	}
};

//////////////////////////////////////////////////////////////////////
//
// Spry.Effect.Opacity
//
//////////////////////////////////////////////////////////////////////

Spry.Effect.Opacity = function(element, startOpacity, stopOpacity, options)
{
	this.dynamicStartOpacity = false;
	if (arguments.length == 3)
	{
		options = stopOpacity;
		stopOpacity = startOpacity;
		startOpacity = Spry.Effect.getOpacity(element);
		this.dynamicStartOpacity = true;
	}

	Spry.Effect.Animator.call(this, options);

	this.name = 'Opacity';
	this.element = Spry.Effect.getElement(element);

    // make this work on IE on elements without 'layout'
    if(/MSIE/.test(navigator.userAgent) && (!this.element.hasLayout))
	  Spry.Effect.setStyleProp(this.element, 'zoom', '1');

	this.startOpacity = startOpacity;
	this.stopOpacity = stopOpacity;
	this.opacityRange = this.startOpacity - this.stopOpacity;
	this.enforceVisible = Spry.Effect.isInvisible(this.element);
};

Spry.Effect.Opacity.prototype = new Spry.Effect.Animator();
Spry.Effect.Opacity.prototype.constructor = Spry.Effect.Opacity;

Spry.Effect.Opacity.prototype.animate = function(position)
{
	var opacity = 0;

	if (this.direction == Spry.forwards) {
		opacity = this.startOpacity - (this.opacityRange * position);
	} else if (this.direction == Spry.backwards) {
		opacity = this.opacityRange * position + this.stopOpacity;
	}
	
	this.element.style.opacity = opacity;
	this.element.style.filter = "alpha(opacity=" + Math.floor(opacity * 100) + ")";

	if(this.enforceVisible)
	{
		Spry.Effect.enforceVisible(this.element);
		this.enforceVisible = false;
	}
};

Spry.Effect.Size.prototype.prepareStart = function() 
{
	if (this.dynamicStartOpacity == true)
	{
		this.startOpacity = Spry.Effect.getOpacity(element);
		this.opacityRange = this.startOpacity - this.stopOpacity;
	}
};

//////////////////////////////////////////////////////////////////////
//
// Spry.Effect.Color
//
//////////////////////////////////////////////////////////////////////

Spry.Effect.Color = function(element, startColor, stopColor, options)
{
	this.dynamicStartColor = false;
	if (arguments.length == 3)
	{
		options = stopColor;
		stopColor = startColor;
		startColor = Spry.Effect.getColor(element);
		this.dynamicStartColor = true;
	}
	
	Spry.Effect.Animator.call(this, options);

	this.name = 'Color';
	this.element = Spry.Effect.getElement(element);

	this.startColor = startColor;
	this.stopColor = stopColor;
	this.startRedColor = Spry.Effect.Utils.hexToInt(startColor.substr(1,2));
	this.startGreenColor = Spry.Effect.Utils.hexToInt(startColor.substr(3,2));
	this.startBlueColor = Spry.Effect.Utils.hexToInt(startColor.substr(5,2));
	this.stopRedColor = Spry.Effect.Utils.hexToInt(stopColor.substr(1,2));
	this.stopGreenColor = Spry.Effect.Utils.hexToInt(stopColor.substr(3,2));
	this.stopBlueColor = Spry.Effect.Utils.hexToInt(stopColor.substr(5,2));
	this.redColorRange = this.startRedColor - this.stopRedColor;
	this.greenColorRange = this.startGreenColor - this.stopGreenColor;
	this.blueColorRange = this.startBlueColor - this.stopBlueColor;
};

Spry.Effect.Color.prototype = new Spry.Effect.Animator();
Spry.Effect.Color.prototype.constructor = Spry.Effect.Color;

Spry.Effect.Color.prototype.animate = function(position)
{
	var redColor = 0;
	var greenColor = 0;
	var blueColor = 0;
	
	if (this.direction == Spry.forwards) {
		redColor = parseInt(this.startRedColor - (this.redColorRange * position));
		greenColor = parseInt(this.startGreenColor - (this.greenColorRange * position));
		blueColor = parseInt(this.startBlueColor - (this.blueColorRange * position));
	} else if (this.direction == Spry.backwards) {
		redColor = parseInt(this.redColorRange * position) + this.stopRedColor;
		greenColor = parseInt(this.greenColorRange * position) + this.stopGreenColor;
		blueColor = parseInt(this.blueColorRange * position) + this.stopBlueColor;
	}

	this.element.style.backgroundColor = Spry.Effect.Utils.rgb(redColor, greenColor, blueColor);
};

Spry.Effect.Size.prototype.prepareStart = function() 
{
	if (this.dynamicStartColor == true)
	{
		this.startColor = Spry.Effect.getColor(element);
		this.startRedColor = Spry.Effect.Utils.hexToInt(startColor.substr(1,2));
		this.startGreenColor = Spry.Effect.Utils.hexToInt(startColor.substr(3,2));
		this.startBlueColor = Spry.Effect.Utils.hexToInt(startColor.substr(5,2));
		this.redColorRange = this.startRedColor - this.stopRedColor;
		this.greenColorRange = this.startGreenColor - this.stopGreenColor;
		this.blueColorRange = this.startBlueColor - this.stopBlueColor;
	}
};

//////////////////////////////////////////////////////////////////////
//
// Spry.Effect.Cluster
//
//////////////////////////////////////////////////////////////////////

Spry.Effect.Cluster = function(options)
{
	
	Spry.Effect.Animator.call(this, options);

	this.name = 'Cluster';

	this.effectsArray = new Array();
	this.currIdx = -1;

	_ClusteredEffect = function(effect, kind)
	{
		this.effect = effect;
		this.kind = kind; // "parallel" or "queue"
		this.isRunning = false;
	};
	
	this.ClusteredEffect = _ClusteredEffect;

};

Spry.Effect.Cluster.prototype = new Spry.Effect.Animator();
Spry.Effect.Cluster.prototype.constructor = Spry.Effect.Cluster;

Spry.Effect.Cluster.prototype.drawEffect = function()
{
	var isRunning = true;
	var allEffectsDidRun = false;
	
	if (this.currIdx == -1)
		this.initNextEffectsRunning();

	var baseEffectIsStillRunning = false;
	var evalNextEffectsRunning = false
	for (var i = 0; i < this.effectsArray.length; i++)
	{
		if (this.effectsArray[i].isRunning == true)
		{
			baseEffectIsStillRunning = this.effectsArray[i].effect.drawEffect();
			if (baseEffectIsStillRunning == false && i == this.currIdx)
			{
				this.effectsArray[i].isRunning = false;
				evalNextEffectsRunning = true;
			}
		}
	}
	if (evalNextEffectsRunning == true)
	{
		allEffectsDidRun = this.initNextEffectsRunning();
	}
	
	if (allEffectsDidRun == true) {
		this.stop();
		isRunning = false;
		for (var i = 0; i < this.effectsArray.length; i++)
		{
			this.effectsArray[i].isRunning = false;
		}
		this.currIdx = -1;
	}

	return isRunning;
	
};

Spry.Effect.Cluster.prototype.initNextEffectsRunning = function()
{
	var allEffectsDidRun = false;
	this.currIdx++;
	if (this.currIdx > (this.effectsArray.length - 1))
	{
		allEffectsDidRun = true;
	}
	else 
	{
		for (var i = this.currIdx; i < this.effectsArray.length; i++)
		{
			if ((i > this.currIdx) && this.effectsArray[i].kind == "queue")
				break;
				
			this.effectsArray[i].effect.start(true);
			this.effectsArray[i].isRunning = true;
			this.currIdx = i;
		};
	}
	return allEffectsDidRun;
};

Spry.Effect.Cluster.prototype.doToggle = function()
{
	if (this.options.toggle == true) {
		if (this.direction == Spry.forwards) {
			this.direction = Spry.backwards;
		} else if (this.direction == Spry.backwards) {
			this.direction = Spry.forwards;
		}
	}
	// toggle all effects of the cluster, too
	for (var i = 0; i < this.effectsArray.length; i++) 
	{
		if (this.effectsArray[i].effect.options && (this.effectsArray[i].effect.options.toggle != null)) {
			if (this.effectsArray[i].effect.options.toggle == true)
			{
				this.effectsArray[i].effect.doToggle();
			}
		}
	}
};

Spry.Effect.Cluster.prototype.cancel = function()
{
	for (var i = 0; i < this.effectsArray.length; i++)
	{
		this.effectsArray[i].effect.cancel();
	}
	if (this.timer) {
		clearInterval(this.timer);
		this.timer = null;
	}
	this.isRunning = false;
};

Spry.Effect.Cluster.prototype.addNextEffect = function(effect)
{
	this.effectsArray[this.effectsArray.length] = new this.ClusteredEffect(effect, "queue");
	if (this.effectsArray.length == 1) {
		// with the first added effect we know the element
		// that the cluster is working on
		this.element = effect.element;
	}
};

Spry.Effect.Cluster.prototype.addParallelEffect = function(effect)
{
	this.effectsArray[this.effectsArray.length] = new this.ClusteredEffect(effect, "parallel");
	if (this.effectsArray.length == 1) {
		// with the first added effect we know the element
		// that the cluster is working on
		this.element = effect.element;
	}
};

//////////////////////////////////////////////////////////////////////
//
// Combination effects
// Custom effects can be build by combining basic effect bahaviour
// like Move, Size, Color, Opacity
//
//////////////////////////////////////////////////////////////////////

Spry.Effect.AppearFade = function (element, options) 
{
	var element = Spry.Effect.getElement(element);

	var durationInMilliseconds = 1000;
	var fromOpacity = 0.0;
	var toOpacity = 100.0;
	var doToggle = false;
	var kindOfTransition = Spry.sinusoidalTransition;
	var setupCallback = null;
	var finishCallback = null;

	if (options)
	{
		if (options.duration != null) durationInMilliseconds = options.duration;
		if (options.from != null) fromOpacity = options.from;
		if (options.to != null) toOpacity = options.to;
		if (options.toggle != null) doToggle = options.toggle;
		if (options.transition != null) kindOfTransition = options.transition;
		if (options.setup != null) setupCallback = options.setup;
		if (options.finish != null) finishCallback = options.finish;
	}
	options = {duration: durationInMilliseconds, toggle: doToggle, transition: kindOfTransition, setup: setupCallback, finish: finishCallback, from: fromOpacity, to: toOpacity};

	fromOpacity = fromOpacity/ 100.0;
	toOpacity = toOpacity / 100.0;

	var appearFadeEffect = new Spry.Effect.Opacity(element, fromOpacity, toOpacity, options);

	appearFadeEffect.name = 'AppearFade';
	var registeredEffect = SpryRegistry.getRegisteredEffect(element, appearFadeEffect);
	registeredEffect.start();
	return registeredEffect;
};


Spry.Effect.Blind = function (element, options) 
{
	var element = Spry.Effect.getElement(element);

	Spry.Effect.makeClipping(element);

	var durationInMilliseconds = 1000;
	var doToggle = false;
	var kindOfTransition = Spry.sinusoidalTransition;
	var doScaleContent = false;
	var setupCallback = null;
	var finishCallback = null;
	var originalRect = Spry.Effect.getDimensionsRegardlessOfDisplayState(element);
	var fromHeightPx  = originalRect.height;
	var toHeightPx    = 0;
	var optionFrom = options ? options.from : originalRect.height;
	var optionTo   = options ? options.to : 0;

	if (options)
	{
		if (options.duration != null) durationInMilliseconds = options.duration;
		if (options.from != null)
		{
			if (Spry.Effect.Utils.isPercentValue(options.from))
				fromHeightPx = Spry.Effect.Utils.getPercentValue(options.from) * originalRect.height / 100;
			else
				fromHeightPx = Spry.Effect.Utils.getPixelValue(options.from);
		}
		if (options.to != null)
		{
			if (Spry.Effect.Utils.isPercentValue(options.to))
				toHeightPx = Spry.Effect.Utils.getPercentValue(options.to) * originalRect.height / 100;
			else
				toHeightPx = Spry.Effect.Utils.getPixelValue(options.to);
		}
		if (options.toggle != null) doToggle = options.toggle;
		if (options.transition != null) kindOfTransition = options.transition;
		if (options.setup != null) setupCallback = options.setup;
		if (options.finish != null) finishCallback = options.finish;
	}

	var fromRect = new Spry.Effect.Utils.Rectangle;
	fromRect.width = originalRect.width;
	fromRect.height = fromHeightPx;

	var toRect = new Spry.Effect.Utils.Rectangle;
	toRect.width = originalRect.width;
	toRect.height = toHeightPx;

	options = {duration:durationInMilliseconds, toggle:doToggle, transition:kindOfTransition, scaleContent:doScaleContent, setup: setupCallback, finish: finishCallback, from: optionFrom, to: optionTo};

	var blindEffect = new Spry.Effect.Size(element, fromRect, toRect, options);
	blindEffect.name = 'Blind';
	var registeredEffect = SpryRegistry.getRegisteredEffect(element, blindEffect);
	registeredEffect.start();
	return registeredEffect;
};


function setupHighlight(element, effect) 
{
	Spry.Effect.setStyleProp(element, 'background-image', 'none');
};

function finishHighlight(element, effect) 
{
	Spry.Effect.setStyleProp(element, 'background-image', effect.options.restoreBackgroundImage);

	if (effect.direction == Spry.forwards)
		Spry.Effect.setStyleProp(element, 'background-color', effect.options.restoreColor);
};

Spry.Effect.Highlight = function (element, options) 
{	
	var durationInMilliseconds = 1000;
	var toColor = "#ffffff";
	var doToggle = false;
	var kindOfTransition = Spry.sinusoidalTransition;
	var setupCallback = setupHighlight;
	var finishCallback = finishHighlight;
	var element = Spry.Effect.getElement(element);
	var fromColor = Spry.Effect.getStyleProp(element, "background-color");
	var restoreColor = fromColor;
	if (fromColor == "transparent") fromColor = "#ffff99";

	var optionFrom = options ? options.from : '#ffff00';
	var optionTo   = options ? options.to : '#0000ff';

	if (options)
	{
		if (options.duration != null) durationInMilliseconds = options.duration;
		if (options.from != null) fromColor = options.from;
		if (options.to != null) toColor = options.to;
		if (options.restoreColor) restoreColor = options.restoreColor;
		if (options.toggle != null) doToggle = options.toggle;
		if (options.transition != null) kindOfTransition = options.transition;
		if (options.setup != null) setupCallback = options.setup;
		if (options.finish != null) finishCallback = options.finish;
	}

	var restoreBackgroundImage = Spry.Effect.getStyleProp(element, 'background-image');
	
	options = {duration: durationInMilliseconds, toggle: doToggle, transition: kindOfTransition, setup: setupCallback, finish: finishCallback, restoreColor: restoreColor, restoreBackgroundImage: restoreBackgroundImage, from: optionFrom, to: optionTo};

	var highlightEffect = new Spry.Effect.Color(element, fromColor, toColor, options);
	highlightEffect.name = 'Highlight';
	var registeredEffect = SpryRegistry.getRegisteredEffect(element, highlightEffect);
	registeredEffect.start();
	return registeredEffect;	
};

Spry.Effect.Slide = function (element, options) 
{
	var element = Spry.Effect.getElement(element);

	var durationInMilliseconds = 2000;
	var doToggle = false;
	var kindOfTransition = Spry.sinusoidalTransition;
	var slideHorizontally = false;
	var setupCallback = null;
	var finishCallback = null;
	var firstChildElt = Spry.Effect.Utils.getFirstChildElement(element);

	// IE 7 does not clip static positioned elements -> make element position relative
	if(/MSIE 7.0/.test(navigator.userAgent) && /Windows NT/.test(navigator.userAgent))
		Spry.Effect.makePositioned(element);

	Spry.Effect.makeClipping(element);

	// for IE 6 on win: check if position is static or fixed -> not supported and would cause trouble
	if(/MSIE 6.0/.test(navigator.userAgent) && /Windows NT/.test(navigator.userAgent))
	{
		var pos = Spry.Effect.getStyleProp(element, 'position');
		if(pos && (pos == 'static' || pos == 'fixed'))
		{
			Spry.Effect.setStyleProp(element, 'position', 'relative');
			Spry.Effect.setStyleProp(element, 'top', '');
			Spry.Effect.setStyleProp(element, 'left', '');
		}
	}

	if(firstChildElt)
	{
		Spry.Effect.makePositioned(firstChildElt);
		Spry.Effect.makeClipping(firstChildElt);

    	var childRect = Spry.Effect.getDimensionsRegardlessOfDisplayState(firstChildElt, element);
		Spry.Effect.setStyleProp(firstChildElt, 'width', childRect.width + 'px');
	}

	var elementRect = Spry.Effect.getDimensionsRegardlessOfDisplayState(element);
	var startOffsetPosition = new Spry.Effect.Utils.Position();
	startOffsetPosition.x = parseInt(Spry.Effect.getStyleProp(firstChildElt, "left"));
	startOffsetPosition.y = parseInt(Spry.Effect.getStyleProp(firstChildElt, "top"));
	if (!startOffsetPosition.x) startOffsetPosition.x = 0;
	if (!startOffsetPosition.y) startOffsetPosition.y = 0;

	if (options && options.horizontal !== null && options.horizontal === true)
		slideHorizontally = true;

	var movePx = slideHorizontally ? elementRect.width : elementRect.height;
	var fromPos = new Spry.Effect.Utils.Position;
	fromPos.x = startOffsetPosition.x;
	fromPos.y = startOffsetPosition.y;

	var toPos = new Spry.Effect.Utils.Position;
	toPos.x = slideHorizontally ? startOffsetPosition.x - movePx : startOffsetPosition.x;
	toPos.y = slideHorizontally ? startOffsetPosition.y : startOffsetPosition.y - movePx;

	var optionFrom = options ? options.from : elementRect.height;
	var optionTo   = options ? options.to : 0;

	if (options)
	{
		if (options.duration != null) durationInMilliseconds = options.duration;

		if (options.from != null)
		{
		    if(slideHorizontally)
		    {
			    if (Spry.Effect.Utils.isPercentValue(options.from))
				    fromPos.x = movePx * Spry.Effect.Utils.getPercentValue(options.from) / 100;
			    else
				    fromPos.x = Spry.Effect.Utils.getPixelValue(options.from);
			}
			else
			{
			    if (Spry.Effect.Utils.isPercentValue(options.from))
				    fromPos.y = movePx * Spry.Effect.Utils.getPercentValue(options.from) / 100;
			    else
				    fromPos.y = Spry.Effect.Utils.getPixelValue(options.from);
			}
		}

		if (options.to != null)
		{
		    if(slideHorizontally)
		    {
			    if (Spry.Effect.Utils.isPercentValue(options.to))
				    toPos.x = movePx * Spry.Effect.Utils.getPercentValue(options.to) / 100;
			    else
				    toPos.x = Spry.Effect.Utils.getPixelValue(options.to);
		    }
		    else
		    {
			    if (Spry.Effect.Utils.isPercentValue(options.to))
				    toPos.y = movePx * Spry.Effect.Utils.getPercentValue(options.to) / 100;
			    else
				    toPos.y = Spry.Effect.Utils.getPixelValue(options.to);
			}
		}

		if (options.toggle != null) doToggle = options.toggle;
		if (options.transition != null) kindOfTransition = options.transition;
		if (options.setup != null) setupCallback = options.setup;
		if (options.finish != null) finishCallback = options.finish;
	}

	options = {duration:durationInMilliseconds, toggle:doToggle, transition:kindOfTransition, setup: setupCallback, finish: finishCallback, from: optionFrom, to: optionTo};
	
	var slideEffect = new Spry.Effect.MoveSlide(element, fromPos, toPos, slideHorizontally, options);
	slideEffect.name = 'Slide';
	var registeredEffect = SpryRegistry.getRegisteredEffect(element, slideEffect);
	registeredEffect.start();
	return registeredEffect;
};


Spry.Effect.GrowShrink = function (element, options) 
{
	var element = Spry.Effect.getElement(element);

	Spry.Effect.makePositioned(element); // for move
	Spry.Effect.makeClipping(element);

	var startOffsetPosition = new Spry.Effect.Utils.Position();
	startOffsetPosition.x = parseInt(Spry.Effect.getStylePropRegardlessOfDisplayState(element, "left"));
	startOffsetPosition.y = parseInt(Spry.Effect.getStylePropRegardlessOfDisplayState(element, "top"));	
	if (!startOffsetPosition.x) startOffsetPosition.x = 0;
	if (!startOffsetPosition.y) startOffsetPosition.y = 0;

	var dimRect = Spry.Effect.getDimensionsRegardlessOfDisplayState(element);
	var originalWidth = dimRect.width;
	var originalHeight = dimRect.height;
	var propFactor = (originalWidth == 0) ? 1 :originalHeight/originalWidth;

	var durationInMilliseconds = 500;
	var doToggle = false;
	var kindOfTransition = Spry.sinusoidalTransition;

	var fromRect = new Spry.Effect.Utils.Rectangle;
	fromRect.width = 0;
	fromRect.height = 0;

	var toRect = new Spry.Effect.Utils.Rectangle;
	toRect.width = originalWidth;
	toRect.height = originalHeight;

	var setupCallback = null;
	var finishCallback = null;

	var doScaleContent = true;

	var optionFrom = options ? options.from : dimRect.width;
	var optionTo   = options ? options.to : 0;

	var calcHeight = false;
	var growFromCenter = true;

	if (options)
	{
		if (options.referHeight != null) calcHeight = options.referHeight;
		if (options.growCenter != null) growFromCenter = options.growCenter;
		if (options.duration != null) durationInMilliseconds = options.duration;
		if (options.from != null) 
		{
			if (Spry.Effect.Utils.isPercentValue(options.from))
			{
				fromRect.width = originalWidth * (Spry.Effect.Utils.getPercentValue(options.from) / 100);
				fromRect.height = originalHeight * (Spry.Effect.Utils.getPercentValue(options.from) / 100);
			}
			else
			{
				if(calcHeight)
				{
					fromRect.height = Spry.Effect.Utils.getPixelValue(options.from);
					fromRect.width  = Spry.Effect.Utils.getPixelValue(options.from) / propFactor;
				}
				else
				{
					fromRect.width = Spry.Effect.Utils.getPixelValue(options.from);
					fromRect.height = propFactor * Spry.Effect.Utils.getPixelValue(options.from);
				}
			}
		}
		if (options.to != null) 
		{
			if (Spry.Effect.Utils.isPercentValue(options.to))
			{
				toRect.width = originalWidth * (Spry.Effect.Utils.getPercentValue(options.to) / 100);
				toRect.height = originalHeight * (Spry.Effect.Utils.getPercentValue(options.to) / 100);
			}
			else
			{
				if(calcHeight)
				{
					toRect.height = Spry.Effect.Utils.getPixelValue(options.to);
					toRect.width  = Spry.Effect.Utils.getPixelValue(options.to) / propFactor;
				}
				else
				{
					toRect.width = Spry.Effect.Utils.getPixelValue(options.to);
					toRect.height = propFactor * Spry.Effect.Utils.getPixelValue(options.to);
				}
			}
		}
		if (options.toggle != null) doToggle = options.toggle;
		if (options.transition != null) kindOfTransition = options.transition;
		if (options.setup != null) setupCallback = options.setup;
		if (options.finish != null) finishCallback = options.finish;		
	}

	options = {duration:durationInMilliseconds, toggle:doToggle, transition:kindOfTransition, scaleContent:doScaleContent, from: optionFrom, to: optionTo};
	
	var effectCluster = new Spry.Effect.Cluster({toggle: doToggle, setup: setupCallback, finish: finishCallback});
	effectCluster.name = 'GrowShrink';
	
	var sizeEffect = new Spry.Effect.Size(element, fromRect, toRect, options);
	effectCluster.addParallelEffect(sizeEffect);

	if(growFromCenter)
	{
		options = {duration:durationInMilliseconds, toggle:doToggle, transition:kindOfTransition, from: optionFrom, to: optionTo};
		var fromPos = new Spry.Effect.Utils.Position;
		fromPos.x = startOffsetPosition.x + (originalWidth - fromRect.width) / 2.0;
		fromPos.y = startOffsetPosition.y + (originalHeight -fromRect.height) / 2.0;

		var toPos = new Spry.Effect.Utils.Position;
		toPos.x = startOffsetPosition.x + (originalWidth - toRect.width) / 2.0;
		toPos.y = startOffsetPosition.y + (originalHeight -toRect.height) / 2.0;

		var initialProps2 = {top: fromPos.y, left: fromPos.x};

		var moveEffect = new Spry.Effect.Move(element, fromPos, toPos, options, initialProps2);
		effectCluster.addParallelEffect(moveEffect);
	}

	var registeredEffect = SpryRegistry.getRegisteredEffect(element, effectCluster);
	registeredEffect.start();
	return registeredEffect;
};


Spry.Effect.Shake = function (element, options) 
{
	var element = Spry.Effect.getElement(element);

	Spry.Effect.makePositioned(element);
	

	var setupCallback = null;
	var finishCallback = null;

	if (options)
	{
		if (options.setup != null) setupCallback = options.setup;
		if (options.finish != null) finishCallback = options.finish;
	}

	var startOffsetPosition = new Spry.Effect.Utils.Position();
	startOffsetPosition.x = parseInt(Spry.Effect.getStyleProp(element, "left"));
	startOffsetPosition.y = parseInt(Spry.Effect.getStyleProp(element, "top"));	
	if (!startOffsetPosition.x) startOffsetPosition.x = 0;
	if (!startOffsetPosition.y) startOffsetPosition.y = 0;	

	var shakeEffectCluster = new Spry.Effect.Cluster({setup: setupCallback, finish: finishCallback});
	shakeEffectCluster.name = 'Shake';

	var fromPos = new Spry.Effect.Utils.Position;
	fromPos.x = startOffsetPosition.x + 0;
	fromPos.y = startOffsetPosition.y + 0;

	var toPos = new Spry.Effect.Utils.Position;
	toPos.x = startOffsetPosition.x + 20;
	toPos.y = startOffsetPosition.y + 0;

	options = {duration:50, toggle:false};
	var effect = new Spry.Effect.Move(element, fromPos, toPos, options);
	shakeEffectCluster.addNextEffect(effect);
	
	var fromPos = new Spry.Effect.Utils.Position;
	fromPos.x = startOffsetPosition.x + 20;
	fromPos.y = startOffsetPosition.y + 0;

	var toPos = new Spry.Effect.Utils.Position;
	toPos.x = startOffsetPosition.x + -20;
	toPos.y = startOffsetPosition.y + 0;

	options = {duration:100, toggle:false};
	var effect = new Spry.Effect.Move(element, fromPos, toPos, options);
	shakeEffectCluster.addNextEffect(effect);

	var fromPos = new Spry.Effect.Utils.Position;
	fromPos.x = startOffsetPosition.x + -20;
	fromPos.y = startOffsetPosition.y + 0;

	var toPos = new Spry.Effect.Utils.Position;
	toPos.x = startOffsetPosition.x + 20;
	toPos.y = startOffsetPosition.y + 0;

	options = {duration:100, toggle:false};
	var effect = new Spry.Effect.Move(element, fromPos, toPos, options);
	shakeEffectCluster.addNextEffect(effect);

	var fromPos = new Spry.Effect.Utils.Position;
	fromPos.x = startOffsetPosition.x + 20;
	fromPos.y = startOffsetPosition.y + 0;

	var toPos = new Spry.Effect.Utils.Position;
	toPos.x = startOffsetPosition.x + -20;
	toPos.y = startOffsetPosition.y + 0;

	options = {duration:100, toggle:false};
	var effect = new Spry.Effect.Move(element, fromPos, toPos, options);
	shakeEffectCluster.addNextEffect(effect);

	var fromPos = new Spry.Effect.Utils.Position;
	fromPos.x = startOffsetPosition.x + -20;
	fromPos.y = startOffsetPosition.y + 0;

	var toPos = new Spry.Effect.Utils.Position;
	toPos.x = startOffsetPosition.x + 20;
	toPos.y = startOffsetPosition.y + 0;

	options = {duration:100, toggle:false};
	var effect = new Spry.Effect.Move(element, fromPos, toPos, options);
	shakeEffectCluster.addNextEffect(effect);

	var fromPos = new Spry.Effect.Utils.Position;
	fromPos.x = startOffsetPosition.x + 20;
	fromPos.y = startOffsetPosition.y + 0;

	var toPos = new Spry.Effect.Utils.Position;
	toPos.x = startOffsetPosition.x + 0;
	toPos.y = startOffsetPosition.y + 0;

	options = {duration:50, toggle:false};
	var effect = new Spry.Effect.Move(element, fromPos, toPos, options);
	shakeEffectCluster.addNextEffect(effect);
	
	var registeredEffect = SpryRegistry.getRegisteredEffect(element, shakeEffectCluster);
	registeredEffect.start();
	return registeredEffect;
}

Spry.Effect.Squish = function (element, options) 
{
	var element = Spry.Effect.getElement(element);
	
	var durationInMilliseconds = 500;
	var doToggle = true;

	var setupCallback = null;
	var finishCallback = null;

	if (options)
	{
		if (options.duration != null) durationInMilliseconds = options.duration;
		if (options.toggle != null) doToggle = options.toggle;
		if (options.setup != null) setupCallback = options.setup;
		if (options.finish != null) finishCallback = options.finish;
	}

	Spry.Effect.makePositioned(element); // for move
	Spry.Effect.makeClipping(element);

	var originalRect = Spry.Effect.getDimensionsRegardlessOfDisplayState(element);

	var startWidth = originalRect.width;
	var startHeight = originalRect.height;

	var stopWidth = 0;
	var stopHeight = 0;

	var fromRect = new Spry.Effect.Utils.Rectangle;
	fromRect.width = startWidth;
	fromRect.height = startHeight;
	
	var toRect = new Spry.Effect.Utils.Rectangle;
	toRect.width = stopWidth;
	toRect.height = stopHeight;
	
	var doScaleContent = true;

	options = {duration:durationInMilliseconds, toggle:doToggle, scaleContent:doScaleContent, setup: setupCallback, finish: finishCallback};

	var squishEffect = new Spry.Effect.Size(element, fromRect, toRect, options);
	squishEffect.name = 'Squish';

	var registeredEffect = SpryRegistry.getRegisteredEffect(element, squishEffect);
	registeredEffect.start();
	return registeredEffect;
};

Spry.Effect.Pulsate = function (element, options) 
{
	var element = Spry.Effect.getElement(element);
	
	var durationInMilliseconds = 400;
	var fromOpacity = 100.0;
	var toOpacity = 0.0;
	var doToggle = false;
	var kindOfTransition = Spry.linearTransition;
	var setupCallback = null;
	var finishCallback = null;

	if (options)
	{
		if (options.duration != null) durationInMilliseconds = options.duration;
		if (options.from != null) fromOpacity = options.from;
		if (options.to != null) toOpacity = options.to;
		if (options.toggle != null) doToggle = options.toggle;
		if (options.transition != null) kindOfTransition = options.transition;
		if (options.setup != null) setupCallback = options.setup;
		if (options.finish != null) finishCallback = options.finish;
	}
	options = {duration:durationInMilliseconds, toggle:doToggle, transition:kindOfTransition, setup: setupCallback, finish: finishCallback};
	fromOpacity = fromOpacity / 100.0;
	toOpacity = toOpacity / 100.0;
	
	var pulsateEffectCluster = new Spry.Effect.Cluster();
	
	var fadeEffect = new Spry.Effect.Opacity(element, fromOpacity, toOpacity, options);
	var appearEffect = new Spry.Effect.Opacity(element, toOpacity, fromOpacity, options);
	
	pulsateEffectCluster.addNextEffect(fadeEffect);
	pulsateEffectCluster.addNextEffect(appearEffect);
	pulsateEffectCluster.addNextEffect(fadeEffect);
	pulsateEffectCluster.addNextEffect(appearEffect);
	pulsateEffectCluster.addNextEffect(fadeEffect);
	pulsateEffectCluster.addNextEffect(appearEffect);
	
	pulsateEffectCluster.name = 'Pulsate';

	var registeredEffect = SpryRegistry.getRegisteredEffect(element, pulsateEffectCluster);
	registeredEffect.start();
	return registeredEffect;
};

Spry.Effect.Puff = function (element, options) 
{
	var element = Spry.Effect.getElement(element);
	
	Spry.Effect.makePositioned(element); // for move

	var setupCallback = null;
	var finishCallback = null;

	if (options)
	{
		if (options.setup != null) setupCallback = options.setup;
		if (options.finish != null) finishCallback = options.finish;
	}

	var puffEffectCluster = new Spry.Effect.Cluster;
	var durationInMilliseconds = 500;

	var originalRect = Spry.Effect.getDimensions(element);
	
	var startWidth = originalRect.width;
	var startHeight = originalRect.height;
		
	var stopWidth = startWidth * 2;
	var stopHeight = startHeight * 2;
	
	var fromRect = new Spry.Effect.Utils.Rectangle;
	fromRect.width = startWidth;
	fromRect.height = startHeight;
	
	var toRect = new Spry.Effect.Utils.Rectangle;
	toRect.width = stopWidth;
	toRect.height = stopHeight;
	
	var doScaleContent = false;
	
	options = {duration:durationInMilliseconds, toggle:false, scaleContent:doScaleContent};
	var sizeEffect = new Spry.Effect.Size(element, fromRect, toRect, options);
	puffEffectCluster.addParallelEffect(sizeEffect);

	options = {duration:durationInMilliseconds, toggle:false};
	var fromOpacity = 1.0;
	var toOpacity = 0.0;
	var opacityEffect = new Spry.Effect.Opacity(element, fromOpacity, toOpacity, options);
	puffEffectCluster.addParallelEffect(opacityEffect);

	options = {duration:durationInMilliseconds, toggle:false};
	var fromPos = new Spry.Effect.Utils.Position;
	fromPos.x = 0;
	fromPos.y = 0;
	var toPos = new Spry.Effect.Utils.Position;
	toPos.x = startWidth / 2.0 * -1.0;
	toPos.y = startHeight / 2.0 * -1.0;
	var moveEffect = new Spry.Effect.Move(element, fromPos, toPos, options);
	puffEffectCluster.addParallelEffect(moveEffect);

	puffEffectCluster.setup = setupCallback;
	puffEffectCluster.finish = finishCallback;
	puffEffectCluster.name = 'Puff';
	
	var registeredEffect = SpryRegistry.getRegisteredEffect(element, puffEffectCluster);
	registeredEffect.start();
	return registeredEffect;
};

Spry.Effect.DropOut = function (element, options) 
{
	var element = Spry.Effect.getElement(element);
	
	var dropoutEffectCluster = new Spry.Effect.Cluster;
	
	var durationInMilliseconds = 500;

	Spry.Effect.makePositioned(element);

	var setupCallback = null;
	var finishCallback = null;

	if (options)
	{
		if (options.setup != null) setupCallback = options.setup;
		if (options.finish != null) finishCallback = options.finish;
	}

	var startOffsetPosition = new Spry.Effect.Utils.Position();
	startOffsetPosition.x = parseInt(Spry.Effect.getStyleProp(element, "left"));
	startOffsetPosition.y = parseInt(Spry.Effect.getStyleProp(element, "top"));	
	if (!startOffsetPosition.x) startOffsetPosition.x = 0;
	if (!startOffsetPosition.y) startOffsetPosition.y = 0;	
	
	var fromPos = new Spry.Effect.Utils.Position;
	fromPos.x = startOffsetPosition.x + 0;
	fromPos.y = startOffsetPosition.y + 0;

	var toPos = new Spry.Effect.Utils.Position;
	toPos.x = startOffsetPosition.x + 0;
	toPos.y = startOffsetPosition.y + 160;

	options = {from:fromPos, to:toPos, duration:durationInMilliseconds, toggle:true};
	var moveEffect = new Spry.Effect.Move(element, options.from, options.to, options);
	dropoutEffectCluster.addParallelEffect(moveEffect);

	options = {duration:durationInMilliseconds, toggle:true};
	var fromOpacity = 1.0;
	var toOpacity = 0.0;
	var opacityEffect = new Spry.Effect.Opacity(element, fromOpacity, toOpacity, options);
	dropoutEffectCluster.addParallelEffect(opacityEffect);

	dropoutEffectCluster.setup = setupCallback;
	dropoutEffectCluster.finish = finishCallback;
	dropoutEffectCluster.name = 'DropOut';
	
	var registeredEffect = SpryRegistry.getRegisteredEffect(element, dropoutEffectCluster);
	registeredEffect.start();
	return registeredEffect;
};

Spry.Effect.Fold = function (element, options) 
{
	var element = Spry.Effect.getElement(element);
	
	var durationInMilliseconds = 1000;
	var doToggle = false;
	var doScaleContent = true;
	
	var foldEffectCluster = new Spry.Effect.Cluster();

	var originalRect = Spry.Effect.getDimensions(element);

	var startWidth = originalRect.width;
	var startHeight = originalRect.height;
		
	var stopWidth = startWidth;
	var stopHeight = startHeight / 5;
	
	var fromRect = new Spry.Effect.Utils.Rectangle;
	fromRect.width = startWidth;
	fromRect.height = startHeight;
	
	var toRect = new Spry.Effect.Utils.Rectangle;
	toRect.width = stopWidth;
	toRect.height = stopHeight;
	
	options = {duration:durationInMilliseconds, toggle:doToggle, scaleContent:doScaleContent};
	var sizeEffect = new Spry.Effect.Size(element, fromRect, toRect, options);
	foldEffectCluster.addNextEffect(sizeEffect);
	
	durationInMilliseconds = 500;
	options = {duration:durationInMilliseconds, toggle:doToggle, scaleContent:doScaleContent};
	fromRect.width = "100%";
	fromRect.height = "20%";
	toRect.width = "10%";
	toRect.height = "20%";
	var sizeEffect = new Spry.Effect.Size(element, fromRect, toRect, options);
	foldEffectCluster.addNextEffect(sizeEffect);
	foldEffectCluster.name = 'Fold';
	
	var registeredEffect = SpryRegistry.getRegisteredEffect(element, foldEffectCluster);
	registeredEffect.start();
	return registeredEffect;
};

//////////////////////////////////////////////////////////////////////
//
// The names of some of the static effect functions will
// change in Spry 1.5. These wrappers will insure that we
// remain compatible with future versions of Spry.
//
//////////////////////////////////////////////////////////////////////

Spry.Effect.DoFade = function (element, options)
{
		return Spry.Effect.AppearFade(element, options);
};

Spry.Effect.DoBlind = function (element, options)
{
		return Spry.Effect.Blind(element, options);
};

Spry.Effect.DoHighlight = function (element, options)
{
		return Spry.Effect.Highlight(element, options);
};

Spry.Effect.DoSlide = function (element, options)
{
		return Spry.Effect.Slide(element, options);
};

Spry.Effect.DoGrow = function (element, options)
{
		return Spry.Effect.GrowShrink(element, options);
};

Spry.Effect.DoShake = function (element, options)
{
		return Spry.Effect.Shake(element, options);
};

Spry.Effect.DoSquish = function (element, options)
{
		return Spry.Effect.Squish(element, options);
};

Spry.Effect.DoPulsate = function (element, options)
{
		return Spry.Effect.Pulsate(element, options);
};

Spry.Effect.DoPuff = function (element, options)
{
		return Spry.Effect.Puff(element, options);
};

Spry.Effect.DoDropOut = function (element, options)
{
		return Spry.Effect.DropOut(element, options);
};

Spry.Effect.DoFold = function (element, options)
{
		return Spry.Effect.Fold(element, options);
};
