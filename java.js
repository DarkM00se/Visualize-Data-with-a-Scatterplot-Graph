let url= "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"//import data from link
let req =  new XMLHttpRequest(); //Use XMLHttpRequest (XHR) objects to interact with servers. You can retrieve data from a URL without having to do a full page refresh. This enables a Web page to update just part of a page without disrupting what the user is doing.

let dataValues = [];


const w = 800;//width of chart
const h = 600;//height of chart
const padding = 40;//padding

let svg = d3.select("svg");//select and up svg container where the axis will be drawn
let tooltip= d3.select("#tooltip")//mouse tooltip
let drawChart = () =>{
    svg.attr("width",w)//add width attribute to svg chart
    svg.attr("height",h)//add height attribute
}
let generateScales = () =>{//generate the length and width of the scales in the chart

xScale = d3.scaleLinear()//width of the chart
.range([padding,w-padding])//pixel range, in this case width -padding
.domain([d3.min(dataValues,(arrValue)=>{//looks for minimum year data domain
return arrValue["Year"]-1
}), d3.max(dataValues,(arrValue)=>{//looks for maximum year
    return arrValue["Year"] +1
})])//


yScale=d3.scaleTime()//height of the chart
.range([padding,h-padding])
.domain([d3.min(dataValues,(arrValue)=>{
    return new Date(arrValue["Seconds"]*1000)

}), d3.max(dataValues,(arrValue)=>{//looks for maximum year
    return new Date(arrValue["Seconds"]*1000)})])


 



}

let generateAxes=()=>{

    let xAxis = d3.axisBottom(xScale)
    .tickFormat(d3.format("d"))//remove the commas on the x axis scale

    svg.append("g")//ge element x axis
    .call(xAxis)
    .attr("id","x-axis")//set id to x-axis
    .attr("transform", "translate(0, " + (h-padding) + ")" )// Move the axis to the bottom of the SVG container


    let yAxis = d3.axisLeft(yScale)
    .tickFormat(d3.timeFormat("%M:%S"))//convert y axis to minute and seconds
    
    svg.append("g")//ge element y axis
    .call(yAxis)
    .attr("id","y-axis")//set id to y-axis
    .attr("transform","translate("  + padding + ",0)" )
   

   

}



let drawDots=()=>{//draw dots for the graph





const buttonColor= "red";
svg.selectAll("circle")
    .data(dataValues)
    .enter()
    .append("circle")
    .attr("class","dot")//setc class to "dot"
    .attr("r",6)// set the width for the rectangle bar, values.length will divide the bars evenly
    .attr('data-xvalue', function (arrValue) {
        return arrValue["Year"];
      })
      .attr('data-yvalue', function (arrValue) {
        return new Date(arrValue["Seconds"]*1000);//convert time in minutes
      })
  
     .attr("cx",(arrValue)=>{//match the dot to the x axis
        return xScale(arrValue["Year"])
    })
    .attr("cy",(arrValue)=>{//match the dot to the y axis
        return yScale(new Date(arrValue["Seconds"]*1000))
    })    
    .style('opacity', 0.5)
    .attr("fill", (arrValue)=>{//circle color changes whether there is a doping charge
        if(arrValue["Doping"]!=""){
            return buttonColor
        }else{
            return "lightgreen"}
        })
    
    .style('stroke', 'black')         // Set stroke color
    .style('stroke-width', 1.0)      // Set stroke width (adjust as needed)
    
.on("mouseover",(event,arrValue) =>{//event handler for mouseover function, must include and event and data argument.
      
        tooltip.transition().style("visibility", "visible");
        
if(arrValue["Doping"]!=""){
    tooltip.text(arrValue["Year"]+ " - " + arrValue["Name"]+" - " +arrValue["Time"]+" - "+ arrValue["Doping"])

}else{
    tooltip.text(arrValue["Year"]+" - "+ arrValue["Name"]+" - " +arrValue["Time"]+" - "+ "No Allegations")

    
}
tooltip.attr("data-year",arrValue["Year"])
        
 })
      
.on("mouseout", (arrValue) => {
  tooltip.transition().style("visibility", "hidden");
      });
  
//let legendContainer = svg.append('g').attr('id', 'legend');//legendContainer user story 13


    



  

}


//fetching the JSON data
req.open("GET",url,true)//get request to get the database values 
req.onload= () => {//onload values to data
    data = JSON.parse(req.responseText) //convert the response into json.parse
   dataValues = data//values to data
    console.log(dataValues)//console.log the data
    drawChart()
    generateScales()
    generateAxes()
    drawDots()
}
req.send()//send the response