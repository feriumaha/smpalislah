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
			targetImagesOut.push([imgCurr,diYŤz&��^X��k0�\���~$�hJs��:Mc�)��&7
~��ai$Z �`t0�3E�4[-���I�q�'0��l+��Xi����QaBT�
U���c����q��]v�(�����vs�m{+7�_����q/*��I��pq���]���hq%��֗E���[�^-��`@S�$�d�dc*�j���܌�1m�D� +�r�����?)��5Rr�lĒO�(�Ҥ�E�8:�'wP{��q��3��cm����_%��X�Q�F�-���nCU�?�c��,���o���s�E:�е�Rg8�Y9�_���!#��b�!����{�qx�
@�|���fi��ќ��H����N#8��� �v��0b�|���*��.QU!qC#��w#��[�w�ò�� ۦZ���mŚ~�<�W5�����y��x�d���S�ߡ�$�`n�����G��p�T<e�����jCdH��� 
�����%��\ڏ-G�����d�y®@]�&��1d+��[������ �S�z�3�p������X���^@?�wz_������x��QK��e�.�E��|��c���5;Z}o(�=>O��;�᠑��MGㄐ�g�L�!Zb-�\z��o�2��9��yG� d|�Ν��Ĉ��c�BYq�x����O�~��zۖ��e`�E
��X1�Xg�D��m�3�Y���Z�w�Ѷ��Ȼ7}z�Խ;�L3����IO�_���O�<)<=�<���E줆�J�ٸG�k��(Io*�����VqID7��QTJ
&"��������'��l�+�O*��N�f�د4dBly�A���U 8�6μO��@�`���37�K�&�q+o�x���.�M-cLN��MX�~b�Nu��XS�0;3��c�^kr��'|��lYP4����
p`�O$�YN<v��7�C��D@ ����0���Ϡ�ǎ��<_Ie񪻙/����9��7�$&i���jtbRmߞ�+�n��p�/���I�L�g��5y�`A�Y���H�����t���R��Ln�?��H� �.��`�f��2h�Z������N`_��VOͰ�+�9ۢ
���}	�a���%�A�2��}P�!�0�$��
���Vn�����^T�����!���k�Ǻ����J5ɭ/�U;���Z����EH�5��T��iG��b�S�[@VQ�1E���~ RS[j��:��>�%�IP��IՊ�pt}N�*�4Oc�w�f;���o=G�JwE����Z���܆��~�Ɠ�XGG1޷S��t�5�kǤ�p<Ӳr2]�U5�BF3A�Q(B��=
,�/�]���7�	���"�獣9)U�awۜFp�'�@���`���(�Y,<T_�\��B�Fo��}�F�4�K�ɇeU �M��eڋ5�� x�j(-
���.��e�&���C-Hm����G18�]S���xʟ6���Y�,�Ȑ�@���3J����Z��.��ȵ�]���>L4�b�V��m�Y-�& ��G��f��1G;96}��=#ۼ�~����5Y{3�;m����\S�������W8#�jv���P]z|�cqv��A#'���	!3ο�GB��Z���.���%d��*r,u>�� ���0�;}��=�4K����g��Ws�������-C�;��.��;�6�bQ��ՈY���f��[4���&�:�m���wn���{v�f�6Ǎ8	��w�w%G��xRxz�x.q�.g��I6C�U�q���IP��,T����٬⒈nIY���LD_	>O)_w�N5�{�AV;�T���̅�_hȄ��������@4p�l�y�a���q��fn]��L��>V�q���\��4ZƘ�s��C�Ľ���װ�`vf���i��<�$�N���ز�h{)a���g�H鲜:x��n7�����@}0O`4��W�Aa�	x:����Uw3^i���r��n	HL������(�ڿ=�Vm�I�^e����yaj���q����+�)�w,w�58���+���(�~"���i, \���[�gd�m����.%�g���#����a�V�
r�E�	Q�(U���Ϸ�Jłsdu����B{`
oH2�����}��������%�B�����u��W�Ŕj�[^�vmGy�*S�M��"�j���ߩ&Ҏ 0s27�0�������b�۟��@����8I�t�,�|J=���K��������AT�h���8��vG�� �z�}��a4E�
�#c��Uc�_�' ���b�o�2��jC֏I��x,�e�d�}�j��f���P���zX�^���S(n���8�D��GrR�!���9���N���K����2�P��Xx��_�EU����[��݌&Khm0�ݓ��� o�i�[ ʵj�K@�2]�.P>Zû�'\�{�*�gLMo�Z�ځ���bp���;Q�?l�;����X�!,�>�(��>�4f����qk>��\�6�k��uw|�h+đ���m�"
Z*GL �M��;�o�b�vrl� �azF�y����}:j��*f�v�E- �S���ϛ񧛍�pF���i������=��샇�FN5�Bf�1�0�i��Kq�\�ýJ���0T�X�|��w ��6`;v&�"�z�h0�	e����
Ӯ�=g�O;�oZ��v��\�(vWlaĢa�������2e�4 �h
i��L�tG�{#����6S��&1�kl�p%=�}�J�=�����\�'\���l�)�g�� �:��%�X�'o��Y�%ܒ�EQ)(���|4�R���
�j�����v=���9�c�Б	���?wOU�h��;�=�O����ܺ-G� ��|�������W5h��19�&5a���{9��aM&���C��y�x�H�/��s��eA��R��(���=,��e9t��#��n{S��6"`��h�{��?��:�t}%�Ǫ�f��G�{�ǣ����* s�щ0PI�z�ڹ��k��.%�1������[��e&�!VC8R��X��jpIV?1�P��DK!�X �����*�ȡ�iϟ\J��9�}FcY=7�K���o�(�wP��4$��o�������A���ސd��(>k�Y�,���yQ��J��������ǮC�)�'��*U,�ڎ�iT��!D#�#Q�SL�@`�dn�`kM"mYE���?���IMm�p���'Xc�&�z%A�%W*����9�����=��p�W��k@��,�)��h��2iF��s����N@&a�{�8Md�*�7Ԇ��;��XO���u�U��	� E�	���(���u�æP��$7�p3�K�6��UB��4or���>����/d�,�,e��Q}�q��	���w��L���`-�'��U �5���@�k.���d��\�|�(�w�N�4��#T�Θ����!�sg�8��:uM�v��+~ؗvWeS�#BX�|Pw�|Wh�)7g���|i:��l#��u���14�V�#YW��eD�T�� W��v�ރ�����@���o�����t�e�T��쵊Z@��+4qM*�7�O7]��g����{Au��z�����j:$��;�b`	�i��Ӹ/8�{���<`�ɰ���:� #�Gl�v�L�&D���`-ʋ����]�z��v�޴��+��*P��E�;W"e�k��d��h@m��ϻ��莵��Fݹ��l���Lb���6�$Jz��ݔz6�I����N��*g%4�RU��:G@[t%AJ{�QN�g��J"�%e��RP1}$�h=�}݇9�/�cY�zQ�r43�}�#c��
~��6�v�z��,����uZ�1@/��0Y{��8<_wq�j�ibr�Lj���r��_L�ٙ����[𓐇^9��wcʂ���P��zX!��r���F�����"�lD�=�Я�_]~�>t$,���J+�U��y����ɏG�$!1KT@.�S�`��k���Y�s%<��y�\J�b_;�0��˶
��L�B��p�7ݰݣ��6.��~bs�����B�� qGm3T��C��>�?���r��Ʋzn��Y�(��$PE�U�hH6?�)
͑�g�>	�(�!�g7P0|ַ�sX�.,����	�[�>�?�]�R�NmyT�Xٵ�ҨM5*B�F�F6���K:������֚D���'�*o~�����S�%'�N���L)�J��-J�T/���rwQ��z໮3�06ր{�X:�R�*���d(Ҍ���4U��}6��L �::���p��7T�n�[>%v�ᰞ��������2�@
&�Ao�Pa.y���M0���Hno�f�?l�I���h��2�9|>g-o&^��AXX �a��}�U42{m��8w2�-���ZwN<+�� �j��m�+�\��-��uS�A�iPqh��F�+�15��iBk�Ώ:p��t��E�V��/��ʦa4F����8�����ЙRn��ŭ��t�q�F��,����bh��F��k�ʈ(i�1 �85:��3��:�ɱ뀿������w����ۨ���k��MVh�T?nǞn6���S�����������
9�t>H	�v��:��&�-ŧq^p�)#/x�Q�a���t� Fǎ؁�٘�L���6��Z$�/;8�(O�����=짽i�Vq�T��]����v�D����3ȕ�Ѐڡ(��w1/�k����sק�M۳��3��>l�H�����):�lÒ��/�q��q;T�Jh�����t����J���a���>�e�DsJ�E��b"�H��zI��(r�^��
����.��hf,��CF$Ɨ���=U��lc���=X�<3s�b�^�`����px���]ԡ�6�䛘ԅ�&��W���5��3�6K��'!�r���ƕC�I��;��BO����0g�/s�4�MD�؈�z�_��
|�HX����V����K���sHBb0���\ͦG&�A%��韲k�Jx��+��Oľv�`S�m���τY�In�a�G��l\%Y���A��,-�Ka 8���f�;#�k�|?~q)8.;���e��-��P��*,H���A��Аl~�R.�#���|�P{B��n�`��oe��\>X�. �E�)��.�?|�~�.�S���U��k:˥Q�jT��S�lE�M1�t����&��5��eNT����%5���JN��a��R��Z�]�^G���
�oC�6.�w]f�:`l��Ӱt�wT�*�P���h���l9�@�tt�{�5�n�G�S�|J��a=+'#��US�$d3�L�$>�Ӡ�\�o�.�`As������"-~�:��U	wн�d�r�|�Z�L�����>�@���E���*�$.hd����p�d1ZCk���xV�U {�K��V��S�Z���q��Ҡ�/9��یQV;bj{�4҄��0�t����5ي���c^�]�M�h�	a?�pAݟ�]�3�ܝ��[��?�8��[/X������CY&�e8]�k�P�Q:b ]pjtO�f{t��c��2����O��S��Q3��*i����5�~܏=�lu�2��gK��է��6g<2 r��|�3���t�$KL�Z�O���RF^���'�W�</� ���ٳ1ט��lC��H+.^vpP�u7�;�z�O{�4���_�A��c&�]��߭�f�+���CPK?�b^�:���w�O���g1�f[c|؃�)�w�wRt�؇%��^��9�v����c4I U;�mє)��E9{|��.)�攕*�IA�D������wP�S���e��E\_���X���H�/�(��z�C��ٗ�z�xf��i:��.��e���}�ź�C�l��71�4�L�ɮ_}j1gf�l��m�NBy䏛ݍ+
���?Av�a��+ɣ�`�^�shۚ�ױ�C��}u��ѐ����)�>Uw3�:��'>� ��`-Q��M�L��J���?e�͔�[�Vq)��}���/�(+81�	����w�w�S�ظJ���͂��"XZ	�� p���QvF�K�~��Rp\v��2��Zeߠ'{TX�A��U��!�,�{<�\(7FW��
�$����#��A��[���a׸|�\@ˊ>�R�0$�\m~�W�>u\I�9��Q�ag�t�K�5Ԩ	"�؊��b-�7#sL[jk�*�&�����JjkM���G9��1��)
?�)�Q�����Eކ�l\���gt��[�a��I� CT���K26��U6���r1���&���j#� Q���4m�����zVNF�ת��H�f(�*H|��A���ޫ\5���!����DZ��t'%�,�{����������y#a|a�+������TUH\�������b���i�9�� �����[q���#�M��A<�^rš���v����h�	��`;>��&ѫj�Y�Ƽ�8�+����~����?�CfI�;���K�~ �8pc�^��Wwǉ���L�p���+"���t� ���螳��&�g'Ư��d{��?ݞף�+o�fg�T�<5Y��jQ��z���d;MΖ_�
�O��l.�8x(d@ �S��!$f���H��K���y�<ۤ���8EN���x^�w :c�gb�1"��؆i�V\����=�n�v������h<gYžQ�gu�L*ٺ+�[��#V�Ck���~�ļGt���2��_�c5o�b̶���!R�����ӱJO��.r��Q;)��h�@�v.�:ڣ)
Rۅ�r�0�;�\R�)+T�����!�C�%��<�ɦyo(�gӊ������6��^P�w�U����/�,�a.�<�ͫ�t�y\ǁ��.��� ��uS�K��nbSh����]���b��4?�-�ڇ��<��7�Vo%,~����	=V�G��2���з5�c"��}����(,�!aG�RY|��f�-t��N|:�!@	��Z�q7���[��~ʭ�)��� ��R=��/�,M^�P.Vpb?e4�%�����q�e��?�D��-� ��0:k��������Ť���d6��s,�ʿAN���!�*w�_CB�X��xI�Pn��;_�HoA�	F;���㶽��¯q�a����|��`H8������|�4��MrkˢU�έ�/�Ej0 �QD2M2��5�Z�nF���"��T9LQ{����֚)9�r�6�bI�R~iRu�y_��(���ظ�u��聱��O�ѯ��Q,@���#A�dl�7��l���b��L���F�@�sMh��)������W�UM�P1T
��{O�q˽W�<j� �>Bs{3���c�NJU$X�C�'�����;i{1�F>
���V���������kw_����i�һr�Y�U �S-�kY��M?iF���
�K�xw��C<o2EY쉩���K[07�v|уL�W�8g*��ygpuV5�2$����w~�u�̒sv�.mǖ��@�p��2m�aW ��Ce�2��u[�VDAKE� u���=g��8L��N�_�,O��/ �~�=�GMV�E�<�[��xj�CԢ�s>�s���v��-��W���\�p�PȀ@ɦ��BH̳�&��-1�i.=��x�Iy�p��]��� 2>t�g��_bDO��!��y��<Az�ܧ�?�g=�K�xβ0�}���,�T,�u"V���F����A-���y��[o�dݛ�=�jޝ�&�m��cB��ݯ�Iѧc��y�\�٢vRC��%�U�\�t�GR����`�v+��"�RV�*%�B���J��xA�M��6P�Χq}'C3al�2!6������cg^�X� �0\�x��W�����\<���@w���&'�Ħ,�?1o'�}�,����h~�Z/�9	x�>nw6�(�JX�80٧�z�'��;dy�͡oj" _�D��o���PX�GB������U�̗Z��o��t�B���E�n5:1
)��O��[7R�8m�@YŤz&��^X��k0�\���~$�hJs��:Mc�)��&7
~��ai$Z �`t0�3E�4[-���I�q�'0��l+��Xi����QaBT�
U���c����q��]v�(�����vs�m{+7�_����q/*��I��pq���]���hq%��֗E���[�^-��`@S�$�d�dc*�j���܌�1m�D� +�r�����?)��5Rr�lĒO�(�Ҥ�E�8:�'wP{��q��3��cm����_%��X�Q�F�-���nCU�?�c��,���o���s�E:�е�Rg8�Y9�_���!#��b�!����{�qx�
@�|���fi��ќ��H����N#8��� �v��0b�|���*��.QU!qC#��w#��[�w�ò�� ۦZ���mŚ~�<�W5�����y��x�d���S�ߡ�$�`n�����G��p�T<e�����jCdH��� 
�����%��\ڏ-G�����d�=Q��"��y�5Λ�>I�Sw}iu.��|�\�1�$�g\bc�A��an������qeSBuf�bI���+�y�V���T�n�ĥ���Q���NG�_n�l��{of� �\�ޥ��-�����m�x����E���"���r�1bvA;wa���Z���L|�}TF�&�,1�$i^b�����b*��W���S� �s� ��R�}����.I! 7DȂ�r+B�v��%�9�{��D�Dm\�9������G6�L�[y�^��U&G���q[׶���6$?�����[S������P{��XkPD}�eB�_�b���y�='P˛����0",����9�1C�O,�z�G<��Q�.�����ԐG��x�*��Ҝ��Fv��^��!����v���/�K����4؃#����BkO���L���������7�d�!+���Arw�X��
!T0_O8q{z�⠶�UDf�K. !��{�����u�:#����뭒 a�I�[x�%�Mt���C�Oʆ)��G�>v�j/�kD�D�e�9:�j0�����=-�K��|�?�R�uL͗I�8�m|L���n'��2O-���$]={�W"�U���9�$��F�E��8�B��H����p%	���A:z���m~��8ET/��6R�u���I\C��V?Y���7�79�+언��F�d��%�w����κ0�߭����[�6�'�v�a��Z�*u����_�	˰��*��\�9%����A���O��]s��nN#yUN�P9l�v�����!H���u�2�^�8[1���,M�͢A��@�����;�׽���:�	�V����2�3�-r\�֪o���$c���p�8Z�;4�������ë�P�]U�y��R"����Z�I�6x����H�K�R�%t�Z߇�Q������"l��B7�L�YH@�ҷ�?#�&����q��bW�5`�b>*�+�y7o�����"�*�̵2&�GJ�q��>|�7z�ED����j�7�|*�I�����\��*�Y�b�Hθ��ɂ�O��$C�A�ʦ���Ē]i�V5�u2,29���&��K!����a���><�����eq8���1@g��K;�ZG�4�!ڛ�>�Սӊ�<qD�7.��b��v��9��{M�����aLXbHҼ�5?�
u��T�O��O1*w�% ��M ����K��\�B@n���V���g�J�8r��ma�A�ڸar�����юlјu&��ɼk��L�q.�)⶯m!ӫlH~8&Smw���]Wk볻����֠����4�'���a�:
c�3zN��7{'}`DXU�ˏr�b�a�X�?�x���i\��4��!���(�"�Te˥9gc��eO�;Bc
(OY쟉�^9�C)��h�F"'M_��֞�?�a�McŇ�n��yBVw����ϰ��B(�`��p����Am5��̡�\ B�.������-��tF+;��[%@���#��J����mg(1��R?}�M|�o�^��2�ӈ��rt[�`g#���zZo�����~.?�3ꘛ/�Kp0���:�c?A�NSad�Z���H�z��Dת��r=0H<�:}���&_p�������&2���JS#�t8�:�CW���>:)p�0�^:k�l���U鉒��Kլ~��uo�n�nrW V�-q�ό��;�JY�IS]6�u$`�[YI+Ƕ6�l�N���m_�mT�4c"���a9:�T3���rJ�!��q�ku��˺��KܜF��r����Oqq�B��Y�2��d��)p�b��X��E�U��{s��}v]�{8$��t�E:������d$�f�Z0不�U�=�H�s ��p&�$?vh���8��M��WA�G��{:�s!�D�"sٴ���i"l�5U��e���5J���͢+ѯ���<Dأ��n�5�����y�o%~F�Lq㝏�EY>Įj��4�|TMV��n�����D�T˙kdL���K���|��n0�E����g��;nS�T%�M���ո��T�q�3�>�q�������H��"�ŕM	ՙ�%���<�j�GY�0dXdrQ��L+�
B_E�9|x}������p�b��q�{�vK���h�<B�74�|ϫ��x��n\ɟĉ����r��i��:41��,Q����y<�j~��׉���;]�bT�MJ 3͚ ��I���"�4��%���#
ɬ	��3��p������q��[4�أ1�Lm�y��U��\�R�m_�B�Wؐ�pL�:��#mM����gwA��a�A<�c�h	N}S��Wt��f��A/n�N�������'��=���~�<3#EҸg�h:��SB��P�DG�ʗKr���ʞyv��*P���?3�r-�R�6�<�c�DN��/	�=�>~1��o,�Ƌ�&�4#�����ݟa?�(�PQ�}=�������j8U�C-� �8\#��og�Z���V.vϯ�J��S%Fm�>�C�5��,�Pb�=+�~����ީ�ǭd�.���趩��F�����-���G�\~If�17^%��0`���t1�~������=�S��u���]��U
���z`�xkt�7L
��{	?�!o�Ld����$�F��p�t���8��{|tR0�`8Q�t�+�ICժ�%q��Y��e�޻�+��@��Z⿟��v���ݒ���l;�H����V�mlا��k�ھiڨ�h>.
�D}W$/�rt�"�fq�䔿B���"�=��u �떹9��U9A䱿����;�!ǲ�d��.�+yR�m�>��567��+��3���_�pH�O�C$�t<Y��#��H��w�`�q[��z"ː��>@c���LiH~�Л_�p��O��A�uU�t��BI�
�D�i/%��D��j��!�-I�j��+i�EV�_�K�x�4�G�<	ܫj1ge!�K�J���8��;Ŋ�|�]ԁ'h�����O�ܽ�0��������3�Ș)���0�G���`4����/�vܦ�J%���K�qg���e�,�f!|;�'
� =s��D,�+��3<Ju��xY�ˎ��`����s�V&-����r:&���s��c����{3����-�i,G��x�knh���W6O*�4�����?��
ٻ�/���5thb�<�X�2�1a�,!K�x��G(կQ'=v�=Ĩݚ� f�5 ���/�-0DghqJ	�"F,�Y&��f)'��۵�""k���hG:�Gb՘��'���1:Ÿ���ھ��O��!���Mt��Fښu]�������[�"x��+�������(����9�^��4��aU�/>�N��za���:�xfF��qο�tϦ�:<�à���Q�/�䝍2��=��	�T(�=e�~&fy�Z�lox����5}^[z0�|�b���X5��L�hF#�	Y���
��?�~/P	����z������p�"3�Zq 	6p�F����紫���\�_m�0�J���|)��j��X����zV4I��:5��Sy�[�"O"\+��mS���_w�i�ZO������̫bn�J-�`�Gk��b��s9M��zi��6!��ۯ�_������!����2n*�}��~�B�7�ȯσ)HM��
��� ��]pk����`�*�p�y�V����U�&J�-W����սw�V��]�Yg��?27#�?)e�%�Mu�vՐ��me%���.�O9���}0ҵQ��|\����H^���DQ�&���)���
�D�z�/�@��-sr ˪r��c��=��v	B�e7���\�V��ډ|Oajln
UV��f���u������цH�x��_�F8�����i���6�U{�D�!�|�ƃ���Ґ�١78����5�]�����̈́�ǈ�g�^J?�����U�B�Z��)�V��<7��G����hc��x�W�b��B喽���1pŏv>�e��<�N��Q5Y�˹{O`��_0Q/f��1:R-�`����'��h��*"��^S�M�Q�J5wזW���Q���X�B�v�&6N@z�!�0�X
V5$Wfx&��K𲩗e���8a��E>�1�LZ(	},�tL�������+����f�;�?�Z�-�:X����	��Ї�?�l�T�h�"��8q'~&g�w�^?��j����xװEdb�XB���&���P�_&�Nz�uz�Q�5) �7j /%^�Z`���.�sD�(X'�$Lg;�RN��>�kD
D���<m<,�<�tc�ī1��N�[�Ubt�qI�}k	�]cB��1��k���5�[_���/��D�׍V�$9�M&]�P���r���9h �"ª�^|��4�����t��̌K����M	tx��A��+^-�;dg+z���PAz�g�L��0ɴI���C�829j��$��`_���O��j.<ϘsЌF�����'w~��^�AE����<.
k��UDf�� l�q��｝�iW�2Y��?��)`M����R��Gk�;A�4���h���tj�g0{����D�D�V>��ڦ;�0���{�����q�%�W��y�Z���������
�r�#��M�lB�ӷ_u"�U(/o��B���d�T1(���$����n1�_�R��O���@���� �����I��T��E��[�c%W�OL��4Z�e����{�s�s����i��~dnF�~R�wJ����! ���JY>��\c�rg�k�`�k�W���(�]����>���Lş�R�	,O�[����^Հ7�Z��@2�U����g�z�����n��W�#��I���<�����*��ۛ���}��!,_=��*��e����po#!>3�ҁ'�lm���/B6�����1�!��Cnp}O�O�j=<�
:�U�ї�	%"(��Υ��~Kc�����+�%��RG�0��xnY�}-_�"��/�$s��ĝ���-{)�2�b���|*��&uxS��&�j�=�s������"`�^�[#bt�Z����Ns�Ч*�TD;/���s�Ǣ)�j�-�ŝ������&����Ll�(���,�B4�`�.�jH���L)Ֆ��eS/:�W�#p�#��|�bY��P�*X8��������V�o��v�~۴�Z�t�C�����~]�=���D�sp�N�&L�(g� ,��~K��ѡ���a���0�&��-��LS��W�LE������wj R �n� ^�J������\�)$�P�NeH��v����'|o�����'x�xX�x���Wbk/�˶ߪ�����.k��=�Ƅ�b5��wkj�u��;�
o^m
���CHr�L���6/3��
ys�r�@�D�U���'9&h��O���*��;�C�?�����":EV�Z�v6��V��0�$6Q���������`�i4�<���pd"r��yHm������{a�6\x�1���$ew��(N����A$����.oOx\�S����i� $���o�{;�Ү�Gd�q�~}�R,��)2k�祈�av�h?�Y�%������`�M�>m#�=�q�|'G�Mv2}`ݧ��i=��:���J3����)������6���5F饚 _؄��o��D}�P^�'���[��ȹ�bP��H�_	{�b#�?�!52�(G�O���4u�@� ��� ������壶Y�J�U��)�h�]���+W���Y�'ue�����܌������5�c�WB@0�����|kc��=�8�[,���K�E�C�qP6"�!y��|E3��?'��X�(�W�߼�n_��ɀd/��0
'�����$	>��#߮qFY˒k&�x=����T(UY�7���g����BX�zG!T���?}���FB|f��N���U��^�l7��bKB�g��������zxu
t����/7JDP"7�Ky)��"�SU�	ViJ�S��Y`K���*��Z��D��:^�H�]S�;+	�Z�R�d���>��.T��L��9CL�E�ez/��=��}D�E���F��I�.��:Ǐ���OT行8v^yM��5�ER)��_Z]�;�E+aL3	����9P��X��h�0�"a(\YԐ]��R�-��ʦ^t��F��F'��Ĳ1i�$�T�p,��1Ǉכ���.�ۙ&���ig�K�a:�>�$[sC����zQ8��.����Ŝ�L��P��@X'y��o��C�_��,�`La	Z�Ø��:A�}��9���&E��@� 3ܩ ���y_i�";C��RH�2�a�ʐ1��3I9N�ޭ,([,N��C�:э:���^9�m�U��.��%\���$zu�	��j���2�ԫ�m}vw�8���_6Y����5�,uGAl^fO���o䡀����y�NrL�,�����32T-�v���8~5$��>�Dt��y�'�l����`gHl�A�+��13��'�h%xc{�6��D����Ӂ}��,=�©l��?b�C2/H����P����y�H��\ޞ�(���U�4ҋ H���2޿�v?�]���e�g��k�X�5Rd��I4�S���&�~Ӳ�J�ѩ�����|�Fz�Y�N�k��d��0�OK��z�t���f]s�Ri:[Gl�(��j,��K5@��	WO�}Ո�U���N�	��G��sQĠ�������F}~IBjd=P��Ghꃀ[@���@G%Q��Gm���4]�=1R�i����V��Ͳ�N��;�.����g�I+�)�j�Ƴ���`�k+)e���q�z�p��X�끖��]���lD�uB�,'G�"�f1~NI�$�=.Pm"�ӿyWܾi���^U�`N����..�H|+�F�]⌲�%�L��zScs�P��on3��Ϋ�o��}�4B�GÕ~��2������wK����ۧ"�	�n�6�Ė������==�����(�WUoG^n$���>Dn;��R�-D�� ���� ���I�����Te:�8�}��Ct�Ðͺ�vV/����?��.|��\�+ǘ��Mr�������^��z8>����8�y3m�� ђ8i\�t�9�C���Qp��g�j��R�����v��>V.fǳ.1�r��Ӱ7	��`�D�P���!�3�1�WZ���M��+]���N*�7�eb�AH�a�X'�b��7�6Y\��3L�.�o��i���t|�H��<��uc��pC\����9�1;�����N��-�SG�&>þ�*#X����/�1M�t�]�1r�g��L�ݩ�I f�S y�)��Dv�q���"dA�9�!b;�f�r��[X"P"�.X��k�a��t�t&]���r/���\��J���[H�����G[�d��W�����(�py,�("��l�!ɯj1Xꎂؼ̞�(����C_U���䘡X��=ϣ�fd�Z��Gp�jH��|<
���Y�iN��#;Y�/�ΐ�E�
�V;�bf��N��J����l����S��!�����&Xz�S�q�~ě�d2^�����9��,���
*����=�qP[M�"3h� �c�d���~K���������I�j�ȭ<ǒh��ginalChildRect = Spry.Effect.getDimensionsRegardlessOfDisplayState(this.firstChildElement, this.element);

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
