/**shameless hack of line.js from the aframe github repo (19/11/18)
 *
 * @author derkarl (Karl Probst)
 * License: MIT (same as aframe)
 */
AFRAME.registerComponent('mline', {
  schema: {
    path: { //eingepflegt von meshline.js
		default: [
	        "-2 -0.8 -10",
	        "2 0.8 -5"
	      ],
	      // Deserialize path in the form of comma-separated vec3s: `0 0 0, 1 1 1, 2 0 3`.
/*	      parse: function (value) {
			  console.log(value);
	        return value.split(',').map(AFRAME.utils.coordinates.parse);
	      },
	      // Serialize array of vec3s in case someone does setAttribute('line', 'path', [...]).
	      stringify: function (data) {
	        return data.map(AFRAME.utils.coordinates.stringify).join(',');
	      }*/
	},
    color: {type: 'color', default: '#74BEC1'},
    opacity: {type: 'number', default: 1},
	maxsegments: {type: 'number', default: 100},
    visible: {default: true},
	label: { default: "ad" },
  },

  multiple: true, //the whole point!

  init: function () {
    var data = this.data;
    var geometry;
    var material;
	var maxsegments=data.maxsegments;
    this.rendererSystem = this.el.sceneEl.systems.renderer;
    material = this.material = new THREE.LineBasicMaterial({
      color: data.color,
      opacity: data.opacity,
      transparent: data.opacity < 1,
      visible: data.visible
    });
    geometry = this.geometry = new THREE.BufferGeometry();
	/* ACHTUNG: 200 als fixe Größe! */
    geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(maxsegments * 3), 3));

    this.el.sceneEl.systems.renderer.applyColorCorrection(material.color);
    this.line = new THREE.Line(geometry, material);
    this.el.setObject3D(this.attrName, this.line);
  },

  update: function (oldData) {
    var data = this.data;
    var geometry = this.geometry;
    var geoNeedsUpdate = false;
    var material = this.material;
    var positionArray = geometry.attributes.position.array;
	console.log("entered!");
/*	if(data.path.length*3!=positionArray.length){
		this.material.dispose();
		this.geometry.dispose();
//		this.remove();
		this.init();
	} //später testen!*/
	
    // Update geometry.
	var dataArray=new Array(3);
	var cnt=0;
	for(var idx=0;(idx<data.path.length&&cnt<positionArray.length-2);idx++){
		cnt=3*idx;
		dataArray=data.path[idx].split(' ');
			positionArray[cnt]=dataArray[0];
			positionArray[cnt+1]=dataArray[1];
			positionArray[cnt+2]=dataArray[2];
	}
	for(;cnt<positionArray.length-2;cnt++){
			positionArray[cnt]=positionArray[cnt-3];
			positionArray[cnt+1]=positionArray[cnt-2];
			positionArray[cnt+2]=positionArray[cnt-1];
	}
	geoNeedsUpdate=true;
    console.log(cnt+"for"+data.label);
    if (geoNeedsUpdate) {
      geometry.attributes.position.needsUpdate = true;
    }

    material.color.setStyle(data.color);
    this.el.sceneEl.systems.renderer.applyColorCorrection(material.color);
    material.opacity = data.opacity;
    material.transparent = data.opacity < 1;
    material.visible = data.visible;
  },

  remove: function () {
    this.el.removeObject3D('line', this.line);
  }
});
