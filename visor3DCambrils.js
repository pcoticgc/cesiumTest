//Disable visibility container_chart_div
document.getElementById('container_chart_div').style.display="none";

// Load Dem Catalonia 5 Meters
var terrain5M = new Cesium.CesiumTerrainProvider(
{
     url: 'https://tilemaps.icgc.cat/terrenys/demextes/'       
});
				
// Load tileMap Ortophoto Catalonia
var map = new Cesium.Viewer('cesiumContainer', 
{
          imageryProvider: new Cesium.createOpenStreetMapImageryProvider({
            url: 'https://tilemaps.icgc.cat/mapfactory/wmts/orto_augmentada/CAT3857/',
            fileExtension: 'jpeg',
            maximumLevel: 50,
            credit: 'Institut Cartográfic i Geológic de Catalunya'
          // Cesium screen properties
          }),
		   vrButton: true,
		   animation: false,
		   baseLayerPicker: false,
		   timeline: false,
		   scene3DOnly: true,
		   sceneMode: Cesium.SceneMode.SCENE3D,
           terrainProvider: terrain5M  
           //scene3DOnly: true,
           //selectionIndicator: false,
           //baseLayerPicker: false
  });
	 
// Cartographic coordinates of the camera	 	 
var initialPosition = new Cesium.Cartesian3.fromDegrees(1.050, 41.035, 2800.0);
var initialOrientation = new Cesium.HeadingPitchRoll.fromDegrees(7.1077496389876024807, -31.987223091598949054, 0.025883251314954971306);
// Animation camera
var homeCameraView = {
                          destination : initialPosition,
                          orientation : {
                                          heading : initialOrientation.heading,
                                          pitch : initialOrientation.pitch,
                                          roll : initialOrientation.roll
                                        }
                      };
map.scene.camera.setView(homeCameraView);
homeCameraView.duration = 6.0;
homeCameraView.maximumHeight = 2000;
homeCameraView.pitchAdjustHeight = 2000;
homeCameraView.endTransform = Cesium.Matrix4.IDENTITY;

map.homeButton.viewModel.command.beforeExecute.addEventListener(function (e) 
{
  e.cancel = true;
   map.scene.camera.flyTo(homeCameraView);
});  
	 	 
// Load data geoJson	 
var geocachePromise = Cesium.GeoJsonDataSource.load('cambrils.geojson');

// Create elements for each data in the geoJson file and give it color 	
geocachePromise.then(function(dataSource) {
// Get the array of entities
var geocacheEntities = dataSource.entities.values;

 
for (var i = 0; i < geocacheEntities.length; i++) {           		 
          if(geocacheEntities[i].properties.VEL < -15)
		  {
			color =  new Cesium.Color.fromBytes(226,26,28,255); 
		  }
		  else if (geocacheEntities[i].properties.VEL >= -15 && geocacheEntities[i].properties.VEL <= -12)
		  {
			color =  new Cesium.Color.fromBytes(239,117,16,255); 
		  }
		  else if (geocacheEntities[i].properties.VEL >= -12 && geocacheEntities[i].properties.VEL <= -9)
		  {
			color =  new Cesium.Color.fromBytes(250,209,5,255);  
		  }		  
		  else if (geocacheEntities[i].properties.VEL >= -9 && geocacheEntities[i].properties.VEL <= -6)
		  {
			color =  new Cesium.Color.fromBytes(255,243,24,255);  			
		  }
		  else if (geocacheEntities[i].properties.VEL >= -6 && geocacheEntities[i].properties.VEL <= -3)
		  {
			color =  new Cesium.Color.fromBytes(174,255,0,255);  
		  } 
		  else if (geocacheEntities[i].properties.VEL >= -3 && geocacheEntities[i].properties.VEL <= 3)
		  {
			color =  new Cesium.Color.fromBytes(4,255,0,255);   
		  }		  
		  else if (geocacheEntities[i].properties.VEL >= 3 && geocacheEntities[i].properties.VEL <= 6)
		  {
			color =  new Cesium.Color.fromBytes(2,255,130,255);  
		  }		  
		  else if (geocacheEntities[i].properties.VEL >= 6 && geocacheEntities[i].properties.VEL <= 9)
		  {
			color =  new Cesium.Color.fromBytes(1,255,203,255); 
		  }		  
		  else if (geocacheEntities[i].properties.VEL >= 9 && geocacheEntities[i].properties.VEL <= 12)
		  {
			color =  new Cesium.Color.fromBytes(1,210,251,255);  
		  }
		  		  
		  else if (geocacheEntities[i].properties.VEL >= 12 && geocacheEntities[i].properties.VEL <= 15)
		  {
			color =  new Cesium.Color.fromBytes(0,121,246,255);  
		  }
		  else 	  
		  {
			  color =  new Cesium.Color.fromBytes(1,32,244,255);  
		  }		  
          map.entities.add({
                             position : geocacheEntities[i].position,
                             point : {
                                       pixelSize : 10,
                                       color : color
                                     },
		                             properties: geocacheEntities[i].properties,
                             });	  
        }
     }); 	
		
//Animation pixelsize move of mouse
var previousPickedEntity;
var handler = map.screenSpaceEventHandler;

handler.setInputAction(function (movement) 
{
    var pickedPrimitive = map.scene.pick(movement.endPosition);
    var pickedEntity = Cesium.defined(pickedPrimitive) ? pickedPrimitive.id : undefined;
    // Unhighlight the previously picked entity
    if (Cesium.defined(previousPickedEntity)) 
	 {
        previousPickedEntity.point.pixelSize = 10;
     }
    // Highlight the currently picked entity
    if (Cesium.defined(pickedEntity) && Cesium.defined(pickedEntity.point)) 
	 {
        pickedEntity.point.pixelSize = 17;
        previousPickedEntity = pickedEntity;
     }
 }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
	 
var displacementData = [];//Array two-dimensional, this will contain the date and the displacement values.
var displacementValues = [];//Array displacement values.

   var handler2 = map.screenSpaceEventHandler;
     handler2.setInputAction(function (movement) 
	{
 		displacementData.length = 0;
		displacementValues.length = 0;
 		var pickedObjects = map.scene.drillPick(movement.position);//Create array elements clik de mouse
		//pickedObjects[0] First element 
 		if (Cesium.defined(pickedObjects)) 
		{
 			if(typeof pickedObjects[0] != "undefined")
			{
 				for (var i = 0; i <  pickedObjects[0].id.properties.propertyNames.length; i++) 
				{
 					var propertyName = pickedObjects[0].id.properties.propertyNames[i];
 					var propertyValue = pickedObjects[0].id.properties.getValue()[propertyName];
					code = pickedObjects[0].id.properties.CODE.getValue();
					vel = pickedObjects[0].id.properties.VEL.getValue();
					coherence = pickedObjects[0].id.properties.COHERENCE.getValue();
					eff_area = pickedObjects[0].id.properties.EFF_AREA.getValue();
 					if(i > 8)
 					{
 					 displacementValues.push(propertyValue);//Datos valores en milimetros
					 var year = propertyName.substr(1,[4]);
					 var month = propertyName.substr(5,[2]);
					 var day = propertyName.substr(7,[2]);
					 month = month - 1;
                     console.info(year + " " + month + " Año mes");	
                     displacementData.push([new Date(year, month, day), displacementValues[i-9]]);					 
 					}
 				 }
                  displacementValues.sort(function(a,b) 
                  {
                  	return a - b;
                  })
                  console.info(displacementValues[0] + " valor menor");
                  console.info(displacementValues[displacementValues.length - 1] + " valor mayor");
                   					writeInfo(); 								
             }
         }
		 for (var i = 0; i <  displacementData.length; i++) 
				{
                  console.info(displacementData[i] + " Valor fecha y desplazamiento");
				}				 
     }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
	 
// Load chart
function writeInfo() 
{
	google.charts.load('current', {packages: ['corechart']});
    google.charts.setOnLoadCallback(drawChart);
}

// Load data geoJson and draw the chart
 function drawChart() 
 {	 
	 document.getElementById('container_chart_div').style.display="block";
	 var  valorsGraficaH = [];
	 valorsGraficaH.length = 0;
	 var min = displacementValues[0];
	 var max = displacementValues[displacementValues.length - 1];
	 //console.info(min + " dentro chart");
	 
	 if (min >= -10 && max <= 10)
			{
          console.info("entre -10 i 10");
		  valorsGraficaH = [-10, -8, -6, -4, -2, 0, 2, 4, 6, 8, 10];
			}
			else if (!(min >= -10) || !(max <= 10))
			{
				max = parseInt(max);
				 console.info(max + " max");
				 max = parseInt(max/5);
				 console.info(max + " max");  
				 max = 5*(max+1);			
				 min = parseInt(min);
				 console.info(min + " min");
				 min = parseInt(min/5);
				 console.info(min + " min"); 
				 min = 5*(min+(-1));

				 valorsGraficaH.push(min);
                 valorsGraficaH.push(0);				 
				 valorsGraficaH.push(max);
				 
				 var pasoMax = max/5;
				 var valorMax;
				 var pasoMin = min/5;
				 var valorMin;
				 
				  if(pasoMax !== 1)
				  {
					 valorMax = 5;
					 while (valorMax < max) 
				  {
                         valorsGraficaH.push(valorMax);
                           valorMax = valorMax+5;
                     }
				  }
				 if(pasoMin !== -1)
				  {
					 valorMin = 5;
					 while (valorMin > min) 
				  {
                         valorsGraficaH.push(valorMin);
                           valorMin = valorMin-5;
                     }
				  }				 			  
		          console.info(valorsGraficaH[0] + "valors");				
			}				
      var chartDiv = document.getElementById('chart_div');
      var data = new google.visualization.DataTable();
	  data.addColumn('date', 'Month');
      data.addColumn('number', 'Desplaçament');   
      data.addRows( displacementData);
	  
      //espais per la el titol superior amn les dades de CODE VEL COHERENCE;
	  var espacio ="\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0";	   	  
	  var mirrorLogOptions = 
	  {
           title: code +espacio+ "vel vertical: " + vel + " mm/any" +espacio+   "coherence: " + coherence  ,
		   lineWidth: 0,
           pointSize: 8,
		   pointShape: 'square',
		   backgroundColor: 
		   {
            fill: '#F4F4F4',
            fillOpacity: 0.9
           },
           width: 1050,
           height: 500,
           hAxis: 
		   {
			   title: 'Data',			   
			   titleFontSize: 15,
			   
             gridlines: 
			 {
               count: 15
             }
           },        
           vAxis: 
		   {
			 title: '[mm]',
             ticks: valorsGraficaH
           }
      };
      function drawMirrorLogChart() {
        var mirrorLogChart = new google.visualization.LineChart(chartDiv);
        mirrorLogChart.draw(data, mirrorLogOptions);
      }

      drawMirrorLogChart();
}

// Close chart 
function closeX()
{
document.getElementById('container_chart_div').style.display="none";
}
 
  // move text
 $( function() {
	$( "#legentVelocityColor" ).draggable();
	$( "#container_chart_div" ).draggable();
  } );
 
 
 