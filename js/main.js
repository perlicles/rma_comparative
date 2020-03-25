google.charts.load('current', { 'packages': ['corechart'] });
//google.setOnLoadCallback(drawChart);

document.addEventListener("DOMContentLoaded", read);

function read() {
    var rmaChosed = $("#rma").children("option:selected").val();
    var concurrentNames = createConcurrentChoices(rmaChosed);
    var htmlConcurrentList = createConcurrentHtmlList(concurrentNames);
    $("#concurrent").html(htmlConcurrentList);
    var htmlBaterryList = batteryOptions(rmaChosed);
    $("#batteries-kind").html(htmlBaterryList);
    runComparative();
    runAdvantages();
    runCostAnalysis();

}

var chartRMAName = "";
var chartConcurrentName = "";
var chartRMAInitialCost = 0;
var chartRMAMonthlyCost = 0;
var chartConcurrentInitialCost = 0;
var chartConcurrentMonthlyCost = 0;


function createCaption() {
    var array = createRawDataArray();
    var annualEconomy = array[11][2] - array[11][1];
    var investmentReturn = calculateInvestimentReturn(array);

    var html ="" 
    
    if(annualEconomy > 0) {
        html += `
            Ecomonize em 12 meses <u>${annualEconomy.toLocaleString('pt-BR', myObj)}</u><br>
        `;
    }else {
        html += "";
    }
    
    if(investmentReturn != "") {
        html += `
            Retorno do investimento em <u>${investmentReturn} meses</u>
        `;
    } else {
        html += "";
    }

    $("#caption").html(html);
}

function calculateInvestimentReturn(arrayData) {
    var result;

    for(i=0;i<arrayData.length;i++) {
        if(arrayData[i][2] > arrayData[i][1]) {
            result = arrayData[i][0];
            break;
        } else {
            result = "";
        }
    }

    return result;

}


function createRawDataArray() {
    var arrayData = [];
    var rmaFactor = chartRMAInitialCost + chartRMAMonthlyCost;
    var concurrentFactor = chartConcurrentInitialCost + chartConcurrentMonthlyCost;

    for(i=0;i<12;i++) {
        if(i<9) {
            arrayData.push([`0${i+1}`, Number(Math.round(rmaFactor+'e2')+'e-2'), concurrentFactor]);
        }else {
            arrayData.push([`${i+1}`, Number(Math.round(rmaFactor+'e2')+'e-2'), concurrentFactor]);
        }

        rmaFactor += chartRMAMonthlyCost;
        concurrentFactor += chartConcurrentMonthlyCost;
    }

    return arrayData;

}

var clearDataArray = [
    ['01', 0, 0],
    ['02', 0, 0],
    ['03', 0, 0],
    ['04', 0, 0],
    ['05', 0, 0],
    ['06', 0, 0],
    ['07', 0, 0],
    ['08', 0, 0],
    ['09', 0, 0],
    ['10', 0, 0],
    ['11', 0, 0],
    ['12', 0, 0]
];

var data = [];
var arrayDataIndex = 0;
var options = {
    title: 'Custo Anual',
    titleTextStyle: { color: '#ccc' },
    hAxis: { title: 'Ano', titleTextStyle: { color: '#ccc' }, textStyle: { color: '#ccc' }, gridlineColor: 'yellow', textPosition: 'in' },
    vAxis: { title: 'Custo', minValue: 0, maxValue: 10000, textPosition: 'in', textStyle: { color: '#ccc' }, gridlineColor: 'transparent', format: "0.00" },
    backgroundColor: { fill: 'transparent' },
    pointSize: 5,
    fontSize: 8,
    fontColor: '#ccc',
    chartArea: { width: '100%', height: '100%' },
    legend: { position: 'in', textStyle: { color: '#ccc' } },
    titlePosition: 'in', axisTitlesPosition: 'in',
    animation: { "startup": true, duration: 200, easing: 'out' },
};

var chart = null;

function drawChart() {

    if (chart == null) {
        chart = new google
        .visualization
        .LineChart(document
            .getElementById('chart-cost-modal'));
    }

    //if (data.length == 0) {
    data = new google.visualization.DataTable();
    data.addColumn('string', 'Mês');
    data.addColumn('number', chartRMAName);
    data.addColumn('number', chartConcurrentName);

    data.addRows(clearDataArray);

    chart.draw(data, options);

    rawDataArray = createRawDataArray();

    drawLineAnimation(rawDataArray);

    createCaption()
    
}

function drawLineAnimation(array) {
    setTimeout(function () {
        data.removeRow(arrayDataIndex);
        data.insertRows(arrayDataIndex, [array[arrayDataIndex]]);
        arrayDataIndex++;
        chart.draw(data, options);

        if (arrayDataIndex < 13) {
            drawLineAnimation(array);
        }
    }, 100);

}

$(window).resize(function () {
    arrayDataIndex = 0;
    drawChart();
});

//Get the modal
var modal = document.getElementById("myModal");

//Get the image and insert it inside the modal - use its "alt" text as a caption
var img;
var modalImg = document.getElementById("img01");
var captionText = document.getElementById("caption");

function runChart() {
    arrayDataIndex = 0;
    //img = document.getElementById("chart-cost-modal");
    modal.style.display = 'block'; 
    //modalImg.src = img.src;
    //captionText.innerHTML = img.alt;
    drawChart();
    
}


// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    clearChart();
    modal.style.display = "none";
}

function clearChart() {
    chart = null;
    data = [];
    drawChart();
}

//********* Page Main Engine **********//
$("#main-form").change(function() {
    runComparative();
    runAdvantages();
    runCostAnalysis();
});
//Product Choices 
$("#rma").change(function() {
    var rmaChosed = $(this).children("option:selected").val();
    var concurrentNames = createConcurrentChoices(rmaChosed);
    var htmlConcurrentList = createConcurrentHtmlList(concurrentNames);
    $("#concurrent").html(htmlConcurrentList);
    var htmlBaterryList = batteryOptions(rmaChosed);
    $("#batteries-kind").html(htmlBaterryList);
});


function createConcurrentChoices(rma) {
    var concurrentList = [];
    for (i = 0; i < machineList.length; i++) {
        if (machineList[i][0] == rma) {
            var concurrentName = machineList[i][1];
            concurrentList.push(concurrentName);
        }
    }
    return concurrentList;
}

function createConcurrentHtmlList(concurrentNamesList) {
    var html = "";
    for (i=0; i < concurrentNamesList.length; i++) {
        html += "<option value='" + concurrentNamesList[i] + "'>" + concurrentNamesList[i] + "</option>"
    }
    return html;
}

function batteryOptions(rmaName) {
    var html = "";
    var batteriesNameList = batteryList(rmaName);
    for (i=0;i<batteriesNameList.length;i++) {
        if (i == 0) {
            html += "<input class='radioCheckFix' name='tipo-de-bateria' type='radio' value='" + batteriesNameList[i] + "' required checked>" + batteriesNameList[i] + "</label><br>";
        } else {
            html += "<input class='radioCheckFix' name='tipo-de-bateria' type='radio' value='" + batteriesNameList[i] + "' required>" + batteriesNameList[i] + "</label><br>";
        }
    }
    return html;
    
}

function batteryList(rmaName) {
    var batteryNames = [];
    for(i=0; i < batteriesList.length; i++) {
        for(j=0;j<batteriesList[i].length;j++) {
            if (batteriesList[i][j][0] == rmaName) {
                batteryNames.push(batteriesList[i][0]);
            }
        }
    }
    return batteryNames;
}

//Comparative block
function runComparative() {
    var rma = $("#rma").val();
    //rma = convertRmaName(rma);
    var concurrent = $("#concurrent").val();
    var htmlTable = comparativeTable(rma, concurrent);
    $("#comparative-table").html(htmlTable);
}


function comparativeTable(rmaName, concurrentName) {
    var html = "";
    var rma = getMachineArray(rmaName);
    var concurrent = getMachineArray(concurrentName);
    html = htmlComparativeTable(rma, concurrent);
    return html;
}

function getMachineArray(machineName) {
    var machine = "";
    for(i=0;i<machineList.length;i++) {
        if (machineList[i][1] == machineName) {
            machine = machineList[i];
            break;
        }
    }
    return machine;
}

function htmlComparativeTable(stihl, other) {
    var html = "";
    html = 
        "<tr>"+
            "<th>Modelo</th>"+
            "<th id='rma-name'>"+stihl[2]+"</th>"+
            "<th id='concurrent-name'>"+other[2]+"</th>"+
        "</tr>"+
        "<tr>"+
            "<td data-th='Modelo'>Fabricante</td>"+
            "<td data-th='"+stihl[2]+"'>"+stihl[3]+"</td>"+
            "<td data-th='"+other[2]+"'>"+other[3]+"</td>"+
        "</tr>"+
        "<tr>"+
            "<td data-th='Modelo'>Tração</td>"+
            "<td data-th='"+stihl[2]+"'>"+stihl[4]+"</td>"+
            "<td data-th='"+other[2]+"'>"+other[4]+"</td>"+
        "</tr>"+
        "<tr>"+
            "<td data-th='Modelo'>Diametro Corte (cm)</td>"+
            "<td data-th='"+stihl[2]+"'>"+stihl[5]+"</td>"+
            "<td data-th='"+other[2]+"'>"+other[5]+"</td>"+
        "</tr>"+
        "<tr>"+
            "<td data-th='Modelo'>Altura corte (mm)</td>"+
            "<td data-th='"+stihl[2]+"'>"+stihl[6]+"</td>"+
            "<td data-th='"+other[2]+"'>"+other[6]+"</td>"+
        "</tr>"+
        "<tr>"+
            "<td data-th='Modelo'>Posições de corte</td>"+
            "<td data-th='"+stihl[2]+"'>"+stihl[7]+"</td>"+
            "<td data-th='"+other[2]+"'>"+other[7]+"</td>"+
        "</tr>"+
        "<tr>"+
            "<td data-th='Modelo'>Regulagem altura</td>"+
            "<td data-th='"+stihl[2]+"'>"+stihl[8]+"</td>"+
            "<td data-th='"+other[2]+"'>"+other[8]+"</td>"+
        "</tr>"+
        "<tr>"+
            "<td data-th='Modelo'>Tanque (l)</td>"+
            "<td data-th='"+stihl[2]+"'>"+stihl[9]+"</td>"+
            "<td data-th='"+other[2]+"'>"+other[9]+"</td>"+
        "</tr>"+
        "<tr>"+
            "<td data-th='Modelo'>Caixa coletora (l)</td>"+
            "<td data-th='"+stihl[2]+"'>"+stihl[10]+"</td>"+
            "<td data-th='"+other[2]+"'>"+other[10]+"</td>"+
        "</tr>"+
        "<tr>"+
            "<td data-th='Modelo'>Descarte lateral</td>"+
            "<td data-th='"+stihl[2]+"'>"+stihl[11]+"</td>"+
            "<td data-th='"+other[2]+"'>"+other[11]+"</td>"+
        "</tr>"+
        "<tr>"+
            "<td data-th='Modelo'>Trituração</td>"+
            "<td data-th='"+stihl[2]+"'>"+stihl[12]+"</td>"+
            "<td data-th='"+other[2]+"'>"+other[12]+"</td>"+
        "</tr>"+
        "<tr>"+
            "<td data-th='Modelo'>Rendimento (m<sup>2</sup>/h)</td>"+
            "<td data-th='"+stihl[2]+"'>"+stihl[13]+"</td>"+
            "<td data-th='"+other[2]+"'>"+other[13]+"</td>"+
        "</tr>"+
        "<tr>"+
            "<td data-th='Modelo'>Inclinação máxima</td>"+
            "<td data-th='"+stihl[2]+"'>"+stihl[14]+"</td>"+
            "<td data-th='"+other[2]+"'>"+other[14]+"</td>"+
        "</tr>"+
        "<tr>"+
            "<td data-th='Modelo'>Consumo em 1h</td>"+
            "<td data-th='"+stihl[2]+"'>"+stihl[15]+"</td>"+
            "<td data-th='"+other[2]+"'>"+other[15]+ " (l)"+"</td>"+
        "</tr>"+
        "<tr>"+
            "<td data-th='Modelo'>Motor</td>"+
            "<td data-th='"+stihl[2]+"'>"+stihl[16]+"</td>"+
            "<td data-th='"+other[2]+"'>"+other[16]+"</td>"+
        "</tr>";

        return html;
}

//Advantages block
function runAdvantages() {
    var concurrent = $("#concurrent").val();
    var machineArray = getMachineArray(concurrent);
    changeAdvantagesTitle();
    var html = htmlAdvantages(machineArray[17])
    $("#advantages").html(html);
}

function changeAdvantagesTitle() {
    var rmaName = $("#rma-name").text();
    var concurrentName = $("#concurrent-name").text();
    var titleText = htmlAdvantagesTitle(rmaName, concurrentName);
    $("#title-advantages").text(titleText);
}

function htmlAdvantagesTitle (rma, concurrent) {
    var text = "";
    text = "Vantagens do " + rma + " vs " + "Cortador " + concurrent;
    return text;
}

function htmlAdvantages(advantagesArray) {
    var list = "";
    advantagesArray.forEach(element => {
        list += "<li>"+ element + "</li>";
    });
    return list;
}

//Cost Analysis block
function runCostAnalysis() {
    createRmaCostTable();
    createConcurrentCostTable();
}

function createRmaCostTable() {
    var arrayInputedData = collectInputData();
    var costAnalysisRmaLines = costAnalysisRmaValues(arrayInputedData);
    var htmlRma = htmlCostAnalysisRma(costAnalysisRmaLines);
    $("#rma-cost-analysis").html(htmlRma);
}

function createConcurrentCostTable() {
    var arrayInputedData = collectInputData();
    var costAnalysisConcurrentLines = costAnalysisConcurrentValues(arrayInputedData);
    var htmlConcurrent = htmlCostAnalysisConcurrent(costAnalysisConcurrentLines);
    $("#concurrent-cost-analysis").html(htmlConcurrent);
}

//0 - RMA Name,1 - Concurrent Name, 2 - Gasolina, 
//3 - Horas, 4 Bateria, 5 - Carregador, 6 - Quantidade de Baterias
//7 - Valor do óleo 4t
function collectInputData() {
    var array = []; 
    array.push($("#rma-name").text());
    array.push($("#concurrent").val());
    array.push($("#valor-litro-gasolina").val());
    array.push($("#horas-trabalho").val());
    array.push($("input[name='tipo-de-bateria']:checked").val());
    array.push($("input[name='tipo-do-carregador']:checked").val());
    array.push($("#baterias-quantidade").val());
    array.push($("#valor-oleo-4t").val());
    return array;
}

function costAnalysisRmaValues(arrayInputs) {
    var resultLines = [];
    var rma = findItem(arrayInputs[0]);
    var rmaCost = rma[18];
    var charger = findItem(arrayInputs[5]);
    var chargerCost = charger[2];
    var battery = findItem(arrayInputs[4]);
    var batteryCost = battery[2];
    var costPerCharge = calculateCostPerCharge(battery,charger);
    var energyPerHour = calculateCostPerHourWork(costPerCharge, battery, rma);
    var annualPowerCost = energyPerHour*arrayInputs[3]*12;
    var carChargerBattery = rmaCost + chargerCost + (batteryCost*arrayInputs[6]);

    resultLines.push(rma[1]);
    chartRMAName = rma[1];
    resultLines.push(arrayInputs[6]);
    resultLines.push(battery[1]);
    resultLines.push(charger[1]);
    resultLines.push(carChargerBattery.toLocaleString('pt-BR', myObj));
    chartRMAInitialCost = carChargerBattery;
    resultLines.push(costPerCharge.toLocaleString('pt-BR', myObj));
    resultLines.push(energyPerHour.toLocaleString('pt-BR', myObj));
    resultLines.push(annualPowerCost.toLocaleString('pt-BR', myObj));
    chartRMAMonthlyCost = (annualPowerCost/12);

    //0-RMA, 1 - Many Batteries, 2 - Battery, 3 - Charger
    //4 - car + charger + battery, 5 - Cost Per Charge
    //6 - Enerty Per Hour, 7 - Annual Power Cost
    return resultLines;

}

function costAnalysisConcurrentValues(arrayInputs) {
    var resultLines = [];
    var car = findItem(arrayInputs[1]);
    var carCost = car[18];
    var gasCost = arrayInputs[2];
    var carGasTank = car[9];
    var refillTankCost = calculateCostPerRefillTank(gasCost, carGasTank);
    var costPerHourWork = calculateCostPerHourWorkConcurrent(car, gasCost);
    var maintenanceCost = calculateMaintenance();
    var annualRefillMantainceCost = costPerHourWork*arrayInputs[3]*12 + maintenanceCost*12;

    //0 - Concurrent Name, 1 - car cost, 2 - Refill cost
    //3 - Cost per hour of work, 4 - Anual Cost
    resultLines.push(car[1]);
    chartConcurrentName = car[1];
    resultLines.push(carCost.toLocaleString('pt-BR', myObj));
    chartConcurrentInitialCost = carCost;
    resultLines.push(refillTankCost.toLocaleString('pt-BR', myObj));
    resultLines.push(costPerHourWork.toLocaleString('pt-BR', myObj));
    resultLines.push(annualRefillMantainceCost.toLocaleString('pt-BR', myObj))
    chartConcurrentMonthlyCost = annualRefillMantainceCost/12;

    return resultLines;

}

function findItem(itemName) {
    
    var item = [];

    for (i = 0; i < machineList.length; i++) {
        if (machineList[i][1] == itemName) {
            item = machineList[i];
            break;
        } 
        
        if (i < chargerList.length && chargerList[i][1] == itemName) {
            item = chargerList[i];
            break;
        }
        
        if (i < batteriesList.length && batteriesList[i][1] == itemName) {
            item = batteriesList[i];
            break;
        }
    }

    return item;

}

function calculateCostPerCharge(batteryUsed, chargerUsed) {
    var result;
    var timeToFullCharge;

    for(i=0;i<batteryUsed.length;i++) {
        if(batteryUsed[i][0] == chargerUsed[0]) {
            timeToFullCharge = batteryUsed[i][1];
            break;
        }
    }

    result = chargerUsed[3]*timeToFullCharge/60*costAveragePower/1000;
    
    return result;
}

function calculateCostPerRefillTank(gas, tank) {
    var result = 0;
    result = gas*tank;
    return result;
}

function calculateCostPerHourWork(costCharge, battery, car) {
    var result;
    var autonomy;

    for(i=0;i<battery.length;i++) {
        if(car[1] == battery[i][0]) {
            autonomy = battery[i][1];
        }
    }

    result = costCharge*60/autonomy;
    return result;

}


function calculateCostPerHourWorkConcurrent(concurrent, gasLitroCost) {
    var result = 0;
    var autonomy = concurrent[19];
    var tankVolume = concurrent[9];

    result = ((tankVolume*60)/autonomy)*gasLitroCost;

    return result;
}

function calculateMaintenance() {
    var carToCalculate = 0;
    var result = 0;
    carToCalculate = $("#concurrent").val();

    for (i = 0; i < machineList.length; i++) {
        if (machineList[i][1] == carToCalculate) {
            result = machineList[i][20];
            break;
        }
    }

    return result;

}

function htmlCostAnalysisRma(arrayRmaLines) {
    var x = arrayRmaLines;
    var html = `
        <div class="level">${x[0]}</div>
                <ul>
                    <li class="li-description">Cortador + ${x[1]} ${x[2]} + ${x[3]}</li>
                    <li class="li-cost">${x[4]}</li>
                    <li class="li-description">Custo por uma carga</li>
                    <li class="li-cost">${x[5]}</li>
                    <li class="li-description">Custo de energia por hora de trabalho</li>
                    <li class="li-cost">${x[6]}</li>
                    <li class="li-description">Custo anual de energia</li>
                    <li class="li-cost">${x[7]}</li>
                </ul>
    `;
    return html;
}

function htmlCostAnalysisConcurrent(arrayConcurrentLines) {
    var y = arrayConcurrentLines;
    var html = `
        <div class="level">${y[0]}</div>
                <ul>
                    <li class="li-description">Cortador</li>
                    <li class="li-cost">${y[1]}</li>
                    <li class="li-description">Custo por reabastecimento</li>
                    <li class="li-cost">${y[2]}</li>
                    <li class="li-description">Custo de abastecimento por hora de trabalho</li>
                    <li class="li-cost">${y[3]}</li>
                    <li class="li-description">Custo anual de manutenção</li>
                    <li class="li-cost">${y[4]}</li>
                </ul>
    `;

    return html;
}


// External Data

var costAveragePower = 0.557; // (kw/h)

var myObj = {
    style: "currency",
    currency: "BRL"
}; // Convert doubles to Currency value

//0 - Name, 1 - Name, 2 - Price, 3 - Power
var chargerList = [
    [
        "AL 101","AL 101", 199, 79
    ],
    [
        "AL 300","AL 300", 399, 330
    ]
];

//0 - Name, 1 - Price, 2 - Energy, 3,4 - Carrinho ==> Autonomia, 5,6 - Charger ==> Time to 100% charge
var batteriesList = [
    [
        "AK 30",
        "AK 30",
        699,
        180,
        ["RMA 460V", 24],
        ["RMA 460", 30],
        ["AL 101", 205],
        ["AL 300", 60]
    ],
    [
        "AK 20",
        "AK 20",
        589,
        144,
        ["RMA 460V", 20],
        ["RMA 460", 25],
        ["AL 101", 180],
        ["AL 300", 55]
    ],
    [
        "AP 300",
        "AP 300",
        999,
        227,
        ["RMA 510V", 17],
        ["RMA 510", 25],
        ["AL 101", 250],
        ["AL 300", 60]
    ],
    [
        "AP 300S",
        "AP 300S",
        1199,
        281,
        ["RMA 510V", 21],
        ["RMA 510", 31],
        ["AL 101", 300],
        ["AL 300", 70]
    ],
    [
        "AP 200",
        "AP 200",
        809,
        187,
        ["RMA 510V", 14],
        ["RMA 510", 31],
        ["AL 101", 200],
        ["AL 300", 55]
    ]
];


//0 - RMA, 1 - Dropdown Name, 2 - Show name, 3 - Manufacturer, 4 - Tranction?, 
//5 - Cut size, 6 - Height, 7 - Height positions, 8 - Height Ajust, 9 - Tank volume, 
//10 - Colletor bag volume, 11 - Lateral Discard, 12 - Shredder mode, 13 - Autonomy, 14 - Inclination angle
//15 - 1h consumption, 16 - Engine, 17 - Advantages of the RMA over this, 18 - Price, 19 - Autonomy in min 
//20 - Monthly maintenance cost
var machineList = [
    [
        "RMA 460",
        "Husqvarna LC 140",
        "LC 140",
        "Husqvarna",
        "Não",
        "40",
        "25 - 75",
        "10",
        "Central",
        0.8,
        "40",
        "Não",
        "Não",
        "500",
        "15º",
        1,
        "Briggs",
        [
            "15 % maior diâmetro de corte: redução do tempo total de corte;", 
            "Cesto recolhedor com 50 % mais capacidade: menos paradas para descarte;",
            "3 opções de corte: possibilita maior flexibilidade ao usuário;", 
            "Sem restrição de ângulo de inclinação do terreno;", 
            "Não necessita manuseio / armazenamento de combustíveis e óleos;",
            "Três posições de altura com fácil regulagem, para usuários de diferentes estaturas;",
            "Menos manutenções;",
            "Mais silencioso."
        ],
        1420,
        48,
        33.33
    ],
    [
        "RMA 510",
        "Husqvarna LC121P",	
        "LC121P",	
        "Husqvarna",
        "Não",
        "53",
        "32 - 87",
        "5", 
        "Individual",	
        1.02,
        "62",
        "Sim",
        "Sim",
        "800", 
        "15º", 
        1,	
        "Briggs", 
        [
            "7 regulagens de corte: mais opção de corte;",
            "Ajuste  da altura de corte em uma única alavanca: mais fácil e prático, com o passar do tempo fica difícil ajustar a altura individual nas rodas, o que faz que o usuário não faça;",
            "Cesto recolhedor com 21 % mais capacidade: menos paradas para descarte;",
            "Três posições de altura da barra de condução, para usuários de diferentes estaturas;",
            "Não necessita manuseio / armazenamento de combustíveis e óleos;",
            "Menos manutenções;",
            "Mais silencioso."
        ],
        1599,
        61.2,
        66.67
    ],
    [
        "RMA 460V",
        "Husqvarna HU550FH",
        "HU550FH",
        "Husqvarna",
        "Sim",
        "56",
        "32 - 86",
        "-",
        "Individual",
        1.5,
        "Não",
        "Sim",
        "Sim",
        "1100",
        "15º",
        1,
        "Kohler/Briggs",
        [
            "Corta 20% mais baixo;",
            "8 posições de regulagem: mais fácil ajustar a altura a necessidade de corte;",
            "Ajuste em uma única alavanca: mais fácil e prático, com o passar do tempo fica difícil ajustar a altura individual nas rodas, o que faz que o usuário não faça;",
            "Cesto recolhedor: muito mais confortável e prático para o usuário, evita a necessidade de rastelar a grama;",
            "Tração traseira é melhor em aclives pois mantém mais o contato com o solo;",
            "Tração variável: mais segurança e conforto, ajusta a velocidade conforme a necessidade;",
            "Motor dedicado para a tração, não rouba potência da lâmina de corte;",
            "Sem restrição de inclinação do terreno;",
            "Não necessita manuseio / armazenamento de combustíveis e óleos;",
            "Três posições de altura com fácil regulagem, para usuários de diferentes estaturas;",
            "Menos manutenções;",
            "Troca a cada 2 anos (nível de manutenções muito caro, compensa trocar equipamento);",
            "Mais silencioso."

        ],
        2198,
        90,
        33.33
    ],
    [
        "RMA 510V",
        "Husqvarna LB155S",
        "LB 155S",
        "Husqvarna",
        "Sim",
        "55",
        "32 - 86",
        "5",
        "Individual",
        1.5,
        "Não",
        "Sim",
        "Sim",
        "1200",
        "15º",
        1,
        "Briggs",
        [
            "Corta 20% mais baixo;",
            "8 posições de regulagem: mais fácil ajustar a altura à necessidade de corte;",
            "Ajuste em uma única alavanca: mais fácil e prático, com o passar do tempo fica difícil ajustar a altura individual nas rodas, o que faz que o usuário não faça;",
            "Cesto recolhedor: muito mais confortável e prático para o usuário, evita a necessidade de rastelar a grama;",
            "Tração traseira é melhor em aclives pois mantém mais o contato com o solo;",
            "Tração variável: mais segurança e conforto, ajusta a velocidade conforme a necessidade;",
            "Motor dedicado para a tração, não rouba potência da lâmina de corte;",
            "Sem restrição de inclinação do terreno;",
            "Não necessita manuseio / armazenamento de combustíveis e óleos;",
            "Três posições de altura com fácil regulagem, para usuários de diferentes estaturas;",
            "Menos manutenções;",
            "Troca a cada 2 anos (nível de manutenções muito caro, compensa trocar equipamento);",
            "Mais silencioso."

        ],
        2127,
        90,
        33.33
    ],
    [
        "RMA 510V",
        "Husqvarna HU700H",
        "HU700H",
        "Husqvarna",
        "Sim",
        "56",
        "28 - 95",
        "7",
        "Central",
        0.9,
        "81,05",
        "Sim",
        "Sim",
        "1300",
        "15º",
        1,
        "Honda",
        [
            "Corta 10% mais baixo;",
            "8 posições de regulagem: mais fácil ajustar a altura à necessidade de corte;",
            "Tração variável: mais segurança e conforto, ajusta a velocidade conforme a necessidade;",
            "Motor dedicado para a tração, não rouba potência da lâmina de corte;",
            "Sem restrição de inclinação do terreno;",
            "Não necessita manuseio / armazenamento de combustíveis e óleos;",
            "Três posições de altura com fácil regulagem, para usuários de diferentes estaturas;",
            "Menos manutenções;",
            "Troca a cada 2 anos (nível de manutenções muito caro, compensa trocar equipamento);",
            "Mais silencioso."

        ],
        2127,
        90,
        66.67
    ],
    [
        "RMA 510V",
        "Kawashima LR225T",
        "LR225T",
        "Kawashima",
        "Sim",
        "55",
        "25 - 75",
        "6",
        "Central",
        1,
        "65",
        "Sim",
        "Sim",
        "1980",
        "20º",
        1,
        "Kawashima",
        [
            "Cesto recolhedor com 15% mais capacidade: menos paradas para descarte;",
            "8 posições de regulagem (33% a mais): mais fácil ajustar a altura à necessidade de corte;",
            "Tração variável: mais segurança e conforto, ajusta a velocidade conforme a necessidade;",
            "Motor dedicado para a tração, não rouba potência da lâmina de corte;",
            "Sem restrição de inclinação do terreno;",
            "Não necessita manuseio / armazenamento de combustíveis e óleos;",
            "Três posições de altura com fácil regulagem, para usuários de diferentes estaturas;",
            "Menos manutenções;",
            "Troca a cada 2 anos (nível de manutenções muito caro, compensa trocar equipamento);",
            "Mais silencioso."
        ],
        1760,
        60,
        66.67
    ],
    [
        "RMA 460",
        "Kawashima LR160P",
        "LR-160P",
        "Kawashima",
        "Não",
        "40,6",
        "25 - 75",
        "5",
        "Individual",
        0.6,
        "40",
        "Sim",
        "Sim",
        "812",
        "20º",
        0.6,
        "Kawashima",
        [
            "Diâmetro de corte 15% maior, mais rendimento do trabalho;",
            "Cesto recolhedor com 50% mais capacidade: menos paradas para descarte;",
            "8 posições de regulagem (60% a mais): mais fácil ajustar a altura à necessidade de corte;",
            "Ajuste em uma única alavanca: mais fácil e prático, com o passar do tempo fica difícil ajustar a altura individual nas rodas o que faz com que o usuário não o faça;",
            "Sem restrição de inclinação do terreno;",
            "Não necessita manuseio e/ou armazenamento de combustíveis e óleos;",
            "Três posições de altura com fácil regulagem, para usuários de diferentes estaturas;",
            "Menos manutenções;",
            "Mais silencioso."
        ],
        861.75,
        60,
        33.33
    ],
    [
        "RMA 510V",
        "Kawashima LR180T",
        "LR-180T",
        "Kawashima",
        "Sim",
        "46",
        "25 - 75",
        "6",
        "Central",
        1,
        "65",
        "Sim",
        "Sim",
        "1656",
        "20º",
        1,
        "Kawashima",
        [
            "8 posições de regulagem (33% a mais): mais fácil ajustar a altura à necessidade de corte;",
            "Motor dedicado para a tração, não rouba potência da lâmina de corte;",
            "Tração variável: mais segurança e conforto, ajusta a velocidade conforme a necessidade;",
            "Sem restrição de inclinação do terreno;",
            "Não necessita manuseio / armazenamento de combustíveis e óleos;",
            "Menos manutenções;",
            "Troca a cada 2 anos (nível de manutenções muito caro, compensa trocar equipamento);",
            "Mais silencioso."
        ],
        1306.25,
        60,
        33.33
    ],
    [
        "RMA 510",
        "Branco B4T6000SL",
        "B4T-6000SL",
        "Branco/Briggs",
        "Não",
        "55",
        "15 - 75",
        "5",
        "Individual",
        2,
        "Não",
        "Sim",
        "Não",
        "900",
        "15º",
        1.5,
        "Branco",
        [
            "8 posições de regulagem (60% a mais): mais fácil ajustar a altura à necessidade de corte;",
            "Ajuste em uma única alavanca: mais fácil e prático, com o passar do tempo fica difícil ajustar a altura individual nas rodas o que faz com que o usuário não o faça;",
            "Cesto recolhedor: muito mais confortável e prático para o usuário, evita a necessidade de rastelar a grama;",
            "Modo moer: possibilita cortar a grama em pedaços bem pequenos que logo se decompõe adubando o gramado;",
            "Três posições de altura com fácil regulagem, para usuários de diferentes estaturas;",
            "Sem restrição de inclinação do terreno;",
            "Não necessita manuseio / armazenamento de combustíveis e óleos;",
            "Menos manutenções;",
            "Mais silencioso."
        ],
        1403.82,
        80,
        66.67
    ],
    [
        "RMA 510V",
        "Branco B4T6000TR",
        "B4T-6000TR",
        "Branco/Briggs",
        "Sim",
        "55",
        "15 - 75",
        "5",
        "Individual",
        2,
        "60",
        "Não",
        "Não",
        "1000",
        "15º",
        1.5,
        "Branco",
        [
            "8 posições de regulagem (60% a mais): mais fácil ajustar a altura à necessidade de corte;",
            "Ajuste em uma única alavanca: mais fácil e prático, com o passar do tempo fica difícil ajustar a altura individual nas rodas o que faz com que o usuário não o faça;",
            "Cesto recolhedor com 25% mais capacidade: menos paradas para descarte",
            "Modo descarte lateral: mais opções para realizar o corte, quando se deseja parar apenas no final do trabalho e recolher a grama que ficará agrupada no centro",
            "Modo moer: possibilita cortar a grama em pedaços bem pequenos que logo se decompõe adubando o gramado;",
            "Tração variável: mais segurança e conforto, ajusta a velocidade conforme a necessidade;",
            "Motor dedicado para a tração, não rouba potência da lâmina de corte;",
            "Três posições de altura com fácil regulagem, para usuários de diferentes estaturas;",
            "Sem restrição de inclinação do terreno;",
            "Não necessita manuseio / armazenamento de combustíveis e óleos;",
            "Menos manutenções;",
            "Troca a cada 2 anos (nível de manutenções muito caro, compensa trocar equipamento);",
            "Mais silencioso."
        ],
        1762.94,
        80,
        66.67
    ],
    [
        "RMA 510",
        "Toyama TLM510SM",
        "TLM510SM",
        "Toyama",
        "Não",
        "51",
        "-",
        "5",
        "Individual",
        1,
        "Não",
        "Sim",
        "Sim",
        "900",
        "15º",
        1,
        "Toyama",
        [
            "7 posições de regulagem (40% a mais): mais fácil ajustar a altura à necessidade de corte;",
            "Ajuste em uma única alavanca: mais fácil e prático, com o passar do tempo fica difícil ajustar a altura individual nas rodas o que faz com que o usuário não o faça;",
            "Cesto recolhedor com 25% mais capacidade: menos paradas para descarte",
            "Sem restrição de inclinação do terreno;",
            "Não necessita manuseio / armazenamento de combustíveis e óleos;",
            "Menos manutenções;",
            "Mais silencioso."
        ],
        879.05,
        60,
        66.67
    ],
    [
        "RMA 460",
        "Toyama TLM420RM-38",
        "TLM420RM-38",
        "Toyama",
        "Não",
        "42",
        "-",
        "5",
        "Central",
        0.6,
        "40",
        "Não",
        "Não",
        "700",
        "15º",
        1,
        "Toyama",
        [
            "Maior largura de corte (9,5% a mais) reduz o número de passadas;",
            "7 posições de regulagem (40% a mais): mais fácil ajustar a altura à necessidade de corte;",
            "Cesto recolhedor com 50% mais capacidade: menos paradas para descarte",
            "Modo descarte lateral: mais opções para realizar o corte, quando se deseja parar apenas no final do trabalho e recolher a grama que ficará agrupada no centro",
            "Modo moer: possibilita cortar a grama em pedaços bem pequenos que logo se decompõe adubando o gramado;",
            "Três posições de altura com fácil regulagem, para usuários de diferentes estaturas;",
            "Sem restrição de inclinação do terreno;",
            "Não necessita manuseio / armazenamento de combustíveis e óleos;",
            "Menos manutenções;",
            "Mais silencioso."
        ],
        944.91,
        36,
        33.33
    ],
    [
        "RMA 460",
        "Trapp CG-40G",
        "CG-40G",
        "Trapp",
        "Não",
        "40",
        "32 - 78",
        "3",
        "2 + 2",
        0.75,
        "Não",
        "Sim",
        "Não",
        "600",
        "15º",
        1,
        "Briggs",
        [
            "Maior largura de corte (15% a mais) reduz o número de passadas;",
            "7 posições de corte, mais opções de ajuste;",
            "Cesto recolhedor, elimina a necessidade de rastelar a grama",
            "Modo descarte lateral: mais opções para realizar o corte, quando se deseja parar apenas no final do trabalho e recolher a grama que ficará agrupada no centro",
            "Modo moer: possibilita cortar a grama em pedaços bem pequenos que logo se decompõe adubando o gramado;",
            "Três posições de altura com fácil regulagem, para usuários de diferentes estaturas;",
            "Sem restrição de inclinação do terreno;",
            "Não necessita manuseio / armazenamento de combustíveis e óleos;",
            "Menos manutenções;",
            "Mais silencioso."
        ],
        1248.21,
        54,
        33.33
    ],
    [
        "RMA 460",
        "Trapp MC850-G",
        "MC850-G",
        "Trapp",
        "Não",
        "48",
        "32 - 78",
        "3",
        "2 + 2",
        0.75,
        "Não",
        "Sim",
        "Não",
        "800",
        "15º",
        1,
        "Briggs",
        [
            "7 posições de corte, mais opções de ajuste;",
            "Ajuste em uma única alavanca, mais fácil e preciso;",
            "Cesto recolhedor, elimina a necessidade de rastelar a grama",
            "Modo moer: possibilita cortar a grama em pedaços bem pequenos que logo se decompõe adubando o gramado;",
            "Três posições de altura com fácil regulagem, para usuários de diferentes estaturas;",
            "Sem restrição de inclinação do terreno;",
            "Não necessita manuseio / armazenamento de combustíveis e óleos;",
            "Menos manutenções;",
            "Mais silencioso."
        ],
        1091.50,
        54,
        33.33
    ],
    [
        "RMA 460",
        "Trapp MC90-G",
        "MC90-G",
        "Trapp",
        "Não",
        "48",
        "25 - 70",
        "5",
        "Individual",
        0.8,
        "46",
        "Não",
        "Não",
        "800",
        "15º",
        1,
        "Briggs",
        [
            "7 posições de corte, mais opções de ajuste;",
            "Ajuste em uma única alavanca, mais fácil e preciso;",
            "Cesto recolhedor com 30% mais capacidade: menos paradas para descarte;",
            "Modo descarte lateral: mais opções para realizar o corte, quando se deseja parar apenas no final do trabalho e recolher a grama que ficará agrupada no centro",
            "Modo moer: possibilita cortar a grama em pedaços bem pequenos que logo se decompõe adubando o gramado;",
            "Três posições de altura com fácil regulagem, para usuários de diferentes estaturas;",
            "Sem restrição de inclinação do terreno;",
            "Não necessita manuseio / armazenamento de combustíveis e óleos;",
            "Menos manutenções;",
            "Mais silencioso."
        ],
        1709,
        54,
        33.33
    ],
    [
        "RMA 460",
        "Trapp MC550G",
        "MC550G",
        "Trapp",
        "Não",
        "48",
        "25 - 70",
        "5",
        "Individual",
        0.95,
        "46",
        "Não",
        "Não",
        "800",
        "15º",
        1,
        "Briggs",
        [
            "7 posições de corte, mais opções de ajuste;",
            "Ajuste em uma única alavanca, mais fácil e preciso;",
            "Cesto recolhedor com 30% mais capacidade: menos paradas para descarte;",
            "Modo descarte lateral: mais opções para realizar o corte, quando se deseja parar apenas no final do trabalho e recolher a grama que ficará agrupada no centro",
            "Modo moer: possibilita cortar a grama em pedaços bem pequenos que logo se decompõe adubando o gramado;",
            "Três posições de altura com fácil regulagem, para usuários de diferentes estaturas;",
            "Sem restrição de inclinação do terreno;",
            "Não necessita manuseio / armazenamento de combustíveis e óleos;",
            "Menos manutenções;",
            "Mais silencioso."
        ],
        1410.79,
        57,
        33.33
    ],
    [
        "RMA 510",
        "Trapp MC650-G",
        "MC650-G",
        "Trapp",
        "Não",
        "48",
        "25 - 70",
        "5",
        "Individual",
        1,
        "46",
        "Não",
        "Não",
        "800",
        "15º",
        1,
        "Briggs",
        [
            "7 posições de corte, mais opções de ajuste;",
            "Ajuste em uma única alavanca, mais fácil e preciso;",
            "Cesto recolhedor com 63% mais capacidade: menos paradas para descarte;",
            "Modo descarte lateral: mais opções para realizar o corte, quando se deseja parar apenas no final do trabalho e recolher a grama que ficará agrupada no centro",
            "Modo moer: possibilita cortar a grama em pedaços bem pequenos que logo se decompõe adubando o gramado;",
            "Três posições de altura com fácil regulagem, para usuários de diferentes estaturas;",
            "Sem restrição de inclinação do terreno;",
            "Não necessita manuseio / armazenamento de combustíveis e óleos;",
            "Menos manutenções;",
            "Mais silencioso."
        ],
        1695.37,
        60,
        66.67
    ],
    [
        "RMA 510",
        "Trapp LF650RM",
        "LF 650RM",
        "Trapp",
        "Não",
        "48",
        "28 - 89",
        "9",
        "Individual",
        1.7,
        "46",
        "Não",
        "Não",
        "800",
        "15º",
        1,
        "Lifan",
        [
            "Ajuste em uma única alavanca, mais fácil e preciso;",
            "Cesto recolhedor com 63% mais capacidade: menos paradas para descarte;",
            "Modo descarte lateral: mais opções para realizar o corte, quando se deseja parar apenas no final do trabalho e recolher a grama que ficará agrupada no centro",
            "Modo moer: possibilita cortar a grama em pedaços bem pequenos que logo se decompõe adubando o gramado;",
            "Três posições de altura com fácil regulagem, para usuários de diferentes estaturas;",
            "Sem restrição de inclinação do terreno;",
            "Não necessita manuseio / armazenamento de combustíveis e óleos;",
            "Menos manutenções;",
            "Mais silencioso."
        ],
        2199,
        102,
        66.67
    ],
    [
        "RMA 460",
        "Trapp LF90-RM",
        "LF90-RM",
        "Trapp",
        "Não",
        "48",
        "28 - 89",
        "9",
        "Individual",
        0.8,
        "46",
        "Não",
        "Não",
        "800",
        "15º",
        1,
        "Lifan",
        [
            "Ajuste em uma única alavanca, mais fácil e preciso;",
            "Cesto recolhedor com 30% mais capacidade: menos paradas para descarte;",
            "Modo descarte lateral: mais opções para realizar o corte, quando se deseja parar apenas no final do trabalho e recolher a grama que ficará agrupada no centro",
            "Modo moer: possibilita cortar a grama em pedaços bem pequenos que logo se decompõe adubando o gramado;",
            "Três posições de altura com fácil regulagem, para usuários de diferentes estaturas;",
            "Sem restrição de inclinação do terreno;",
            "Não necessita manuseio / armazenamento de combustíveis e óleos;",
            "Menos manutenções;",
            "Mais silencioso."
        ],
        1999,
        48,
        33.33
    ],
    [
        "RMA 460",
        "Trapp RM-550G",
        "RM-550 G",
        "Trapp",
        "Não",
        "48",
        "28 - 89",
        "9",
        "Individual",
        0.95,
        "46",
        "Não",
        "Não",
        "800",
        "15º",
        1,
        "Briggs",
        [
            "Ajuste em uma única alavanca, mais fácil e preciso;",
            "Cesto recolhedor com 30% mais capacidade: menos paradas para descarte;",
            "Modo descarte lateral: mais opções para realizar o corte, quando se deseja parar apenas no final do trabalho e recolher a grama que ficará agrupada no centro",
            "Modo moer: possibilita cortar a grama em pedaços bem pequenos que logo se decompõe adubando o gramado;",
            "Três posições de altura com fácil regulagem, para usuários de diferentes estaturas;",
            "Sem restrição de inclinação do terreno;",
            "Não necessita manuseio / armazenamento de combustíveis e óleos;",
            "Menos manutenções;",
            "Mais silencioso."
        ],
        1410.79,
        57,
        66.67
    ],
    [
        "RMA 460",
        "Trapp RM-650G",
        "RM-650 G",
        "Trapp",
        "Não",
        "48",
        "28 - 89",
        "9",
        "Individual",
        1,
        "46",
        "Não",
        "Não",
        "800",
        "15º",
        1,
        "Briggs",
        [
            "Diametro de corte 6% maior, reduz as passadas e o tempo de corte",
            "Ajuste em uma única alavanca, mais fácil e preciso;",
            "Cesto recolhedor com 30% mais capacidade: menos paradas para descarte;",
            "Modo descarte lateral: mais opções para realizar o corte, quando se deseja parar apenas no final do trabalho e recolher a grama que ficará agrupada no centro",
            "Modo moer: possibilita cortar a grama em pedaços bem pequenos que logo se decompõe adubando o gramado;",
            "Três posições de altura com fácil regulagem, para usuários de diferentes estaturas;",
            "Sem restrição de inclinação do terreno;",
            "Não necessita manuseio / armazenamento de combustíveis e óleos;",
            "Menos manutenções;",
            "Mais silencioso."
        ],
        1862.10,
        60,
        66.67
    ],
    [
        "RMA 510V",
        "Trapp CR55-C",
        "CR55-C",
        "Trapp",
        "Sim",
        "51",
        "28 - 89",
        "9",
        "Individual",
        1,
        "44",
        "Não",
        "Não",
        "1000",
        "15º",
        1,
        "Briggs",
        [
            "Tração traseira é melhor para terrenos com aclives;",
            "Tração variável: mais segurança e conforto, ajusta a velocidade conforme a necessidade;",
            "Motor dedicado para a tração, não rouba a potência da lâmina de corte;",
            "Ajuste em uma única alavanca, mais fácil e preciso;",
            "Cesto recolhedor com 87% mais capacidade: menos paradas para descarte;",
            "Modo descarte lateral: mais opções para realizar o corte, quando se deseja parar apenas no final do trabalho e recolher a grama que ficará agrupada no centro",
            "Modo moer: possibilita cortar a grama em pedaços bem pequenos que logo se decompõe adubando o gramado;",
            "Três posições de altura com fácil regulagem, para usuários de diferentes estaturas;",
            "Sem restrição de inclinação do terreno;",
            "Não necessita manuseio / armazenamento de combustíveis e óleos;",
            "Menos manutenções;",
            "Mais silencioso."
        ],
        3999.90,
        60,
        66.67
    ],
    [
        "RMA 510V",
        "Trapp JT55-C(1)",
        "JT55-C(1)",
        "Trapp",
        "Sim",
        "51",
        "28 - 89",
        "9",
        "Individual",
        0.8,
        "44",
        "Não",
        "Não",
        "1000",
        "15º",
        1,
        "Briggs",
        [
            "Tração traseira é melhor para terrenos com aclives;",
            "Tração variável: mais segurança e conforto, ajusta a velocidade conforme a necessidade;",
            "Motor dedicado para a tração, não rouba a potência da lâmina de corte;",
            "Ajuste em uma única alavanca, mais fácil e preciso;",
            "Cesto recolhedor com 87% mais capacidade: menos paradas para descarte;",
            "Modo descarte lateral: mais opções para realizar o corte, quando se deseja parar apenas no final do trabalho e recolher a grama que ficará agrupada no centro",
            "Modo moer: possibilita cortar a grama em pedaços bem pequenos que logo se decompõe adubando o gramado;",
            "Três posições de altura com fácil regulagem, para usuários de diferentes estaturas;",
            "Sem restrição de inclinação do terreno;",
            "Não necessita manuseio / armazenamento de combustíveis e óleos;",
            "Menos manutenções;",
            "Troca a cada 2 anos (nível de manutenções muito caros, compensa trocar equipamento);",
            "Mais silencioso."
        ],
        3197.30,
        60,
        66.67
    ],
    [
        "RMA 510V",
        "Trapp JT55-C(2)",
        "JT55-C(2)",
        "Trapp",
        "Sim",
        "51",
        "28 - 89",
        "9",
        "Individual",
        0.95,
        "44",
        "Não",
        "Não",
        "1000",
        "15º",
        1,
        "Briggs",
        [
            "Tração traseira é melhor para terrenos com aclives;",
            "Tração variável: mais segurança e conforto, ajusta a velocidade conforme a necessidade;",
            "Motor dedicado para a tração, não rouba a potência da lâmina de corte;",
            "Ajuste em uma única alavanca, mais fácil e preciso;",
            "Cesto recolhedor com 87% mais capacidade: menos paradas para descarte;",
            "Modo descarte lateral: mais opções para realizar o corte, quando se deseja parar apenas no final do trabalho e recolher a grama que ficará agrupada no centro",
            "Modo moer: possibilita cortar a grama em pedaços bem pequenos que logo se decompõe adubando o gramado;",
            "Três posições de altura com fácil regulagem, para usuários de diferentes estaturas;",
            "Sem restrição de inclinação do terreno;",
            "Não necessita manuseio / armazenamento de combustíveis e óleos;",
            "Menos manutenções;",
            "Troca a cada 2 anos (nível de manutenções muito caros, compensa trocar equipamento);",
            "Mais silencioso."
        ],
        2799.90,
        60,
        66.67
    ],
    [
        "RMA 510V",
        "Trapp JT55-C(3)",
        "JT55-C(3)",
        "Trapp",
        "Sim",
        "51",
        "28 - 89",
        "9",
        "Individual",
        1,
        "44",
        "Não",
        "Não",
        "1000",
        "15º",
        1,
        "Briggs",
        [
            "Tração traseira é melhor para terrenos com aclives;",
            "Tração variável: mais segurança e conforto, ajusta a velocidade conforme a necessidade;",
            "Motor dedicado para a tração, não rouba a potência da lâmina de corte;",
            "Ajuste em uma única alavanca, mais fácil e preciso;",
            "Cesto recolhedor com 87% mais capacidade: menos paradas para descarte;",
            "Modo descarte lateral: mais opções para realizar o corte, quando se deseja parar apenas no final do trabalho e recolher a grama que ficará agrupada no centro",
            "Modo moer: possibilita cortar a grama em pedaços bem pequenos que logo se decompõe adubando o gramado;",
            "Três posições de altura com fácil regulagem, para usuários de diferentes estaturas;",
            "Sem restrição de inclinação do terreno;",
            "Não necessita manuseio / armazenamento de combustíveis e óleos;",
            "Menos manutenções;",
            "Troca a cada 2 anos (nível de manutenções muito caros, compensa trocar equipamento);",
            "Mais silencioso."
        ],
        2399.56,
        60,
        66.67
    ],
    [
        "RMA 510V",
        "Trapp LF55-C",
        "LF55-C",
        "Trapp",
        "Sim",
        "51",
        "28 - 89",
        "9",
        "Individual",
        1.7,
        "44",
        "Não",
        "Não",
        "1000",
        "15º",
        1,
        "Lifan",
        [
            "Tração traseira é melhor para terrenos com aclives;",
            "Tração variável: mais segurança e conforto, ajusta a velocidade conforme a necessidade;",
            "Motor dedicado para a tração, não rouba a potência da lâmina de corte;",
            "Ajuste em uma única alavanca, mais fácil e preciso;",
            "Cesto recolhedor com 70% mais capacidade: menos paradas para descarte;",
            "Modo descarte lateral: mais opções para realizar o corte, quando se deseja parar apenas no final do trabalho e recolher a grama que ficará agrupada no centro",
            "Modo moer: possibilita cortar a grama em pedaços bem pequenos que logo se decompõe adubando o gramado;",
            "Três posições de altura com fácil regulagem, para usuários de diferentes estaturas;",
            "Sem restrição de inclinação do terreno;",
            "Não necessita manuseio / armazenamento de combustíveis e óleos;",
            "Menos manutenções;",
            "Troca a cada 2 anos (nível de manutenções muito caros, compensa trocar equipamento);",
            "Mais silencioso."
        ],
        2890,
        102,
        66.67
    ],
    [
        "RMA 460",
        "Buffalo BFG 40R",
        "BFG 40R",
        "Buffalo",
        "Não",
        "40",
        "25 - 70",
        "5",
        "Individual",
        0.8,
        "40",
        "Não",
        "Não",
        "-",
        "15º",
        1,
        "Buffalo",
        [
            "15% maior largura de corte, redução no tempo total de corte;",
            "7 posições de corte, 40% mais posições de regulagens;",
            "Ajuste da altura de corte em uma única alavanca: mais fácil e prático, com o passar do tempo fica difícil ajustar a altura individual nas rodas, o que faz com que o usuário não o faça;",
            "Cesto recolhedor com capacidade 50% maior, resulta em menos tempo de parada e mais agilidade na execução do corte;",
            "24% mais leve, mais fácil de manusear e menor desgaste operacional;",
            "Três posições de ajuste da barra de condução para melhor se adaptar a diferentes estaturas de usuários;",
            "Função descarte lateral, além de mais uma opção de corte, proporciona um trabalho mais rápido;",
            "Função moer, permite cortar a grama em pequenos pedaços que facilitam a decomposição;",
            "Sem restrição de inclinação do terreno;",
            "Não necessita manuseio e/ou armazenamento de combustíveis e óleos;",
            "Mais silencioso."
        ],
        1648,
        48,
        33.33
    ],
    [
        "RMA 510",
        "Buffalo BFG 50SL",
        "BFG 50SL",
        "Buffalo",
        "Não",
        "51",
        "28 - 89",
        "9",
        "Individual",
        1,
        "Não",
        "Sim",
        "Não",
        "-",
        "15º",
        1,
        "Buffalo",
        [
            "Ajuste da altura de corte em uma única alavanca: mais fácil e prático, com o passar do tempo fica difícil ajustar a altura individual nas rodas, o que faz com que o usuário não o faça;",
            "Cesto recolhedor com 75 litros, quando acabar de cortar a área não necessita rastelar a grama;",
            "26% mais leve, mais fácil de manusear e menor desgaste operacional;",
            "Três posições de ajuste da barra de condução para melhor se adaptar a diferentes estaturas de usuários;",
            "Função moer, permite cortar a grama em pequenos pedaços que facilitam a decomposição;",
            "Sem restrição de inclinação do terreno;",
            "Não necessita manuseio e/ou armazenamento de combustíveis e óleos;",
            "Baixo gasto com manutenções: nível de manutenções do motor a gasolina é muito caro, compensa trocar equipamento a cada 2 anos;",
            "Mais silencioso."
        ],
        1803,
        60,
        66.67
    ],
    [
        "RMA 510",
        "Buffalo BFG 53SLR",
        "BFG 53SLR",
        "Buffalo",
        "Não",
        "53",
        "28 - 89",
        "9",
        "Individual",
        1,
        "60",
        "Sim",
        "Sim",
        "-",
        "15º",
        1,
        "Buffalo",
        [
            "Ajuste da altura de corte em uma única alavanca: mais fácil e prático, com o passar do tempo fica difícil ajustar a altura individual nas rodas, o que faz com que o usuário não o faça;",
            "Cesto recolhedor com 60 litros, quando acabar de cortar a área não necessita rastelar a grama;",
            "38% mais leve, mais fácil de manusear e menor desgaste operacional;",
            "Função moer: permite cortar a grama em pequenos pedaços que facilitam a decomposição;",
            "Sem a necessidade de troca de óleo a cada 25h ou a cada 6 meses, onerando o usuário;",
            "Sem restrição de inclinação do terreno;",
            "Não necessita manuseio e/ou armazenamento de combustíveis e óleos;",
            "Menos paradas para manutenções;",
            "Baixo gasto com manutenções: nível de manutenções do motor a gasolina é muito caro, compensa trocar equipamento a cada 2 anos;",
            "Mais silencioso."
        ],
        2569,
        60,
        66.67
    ],
    [
        "RMA 510V",
        "Buffalo BFGT 53SLR",
        "BFGT 53SLR",
        "Buffalo",
        "Sim",
        "53",
        "28 - 89",
        "9",
        "Individual",
        1,
        "60",
        "Sim",
        "Sim",
        "-",
        "-",
        1,
        "Buffalo",
        [
            "Ajuste da altura de corte em uma única alavanca: mais fácil e prático, com o passar do tempo fica difícil ajustar a altura individual nas rodas, o que faz com que o usuário não o faça;",
            "Cesto recolhedor com capacidade 25% maior, mais capacidade de recolhimento, menos paradas, maior rendimento de trabalho;",
            "35% mais leve, mais fácil de manusear e menor desgaste operacional;",
            "Três posições de ajuste da barra de condução para melhor se adaptar a diferentes estaturas de usuários;",
            "Sem restrição de inclinação do terreno;",
            "Não necessita manuseio e/ou armazenamento de combustíveis e óleos;",
            "Menos paradas para manutenções;",
            "Baixo gasto com manutenções: nível de manutenções do motor a gasolina é muito caro, compensa trocar equipamento a cada 2 anos;",
            "Mais silencioso."
        ],
        2895,
        60,
        66.67
    ],
    [
        "RMA 460",
        "Tramontina CC 45M",
        "CC 45M",
        "Tramontina",
        "Não",
        "45",
        "24 - 62",
        "4",
        "Individual",
        0.75,
        "Não",
        "Sim",
        "Não",
        "-",
        "15º",
        1,
        "Powermore",
        [
            "7 posições de regulagem de corte (75% a mais), possibilita mais opções de trabalho;",
            "Ajuste da altura de corte em uma única alavanca: mais fácil e prático, com o passar do tempo fica difícil ajustar a altura individual nas rodas, o que faz com que o usuário não o faça;",
            "Cesto recolhedor com 60 litros, ao final do corte do gramado não necessita rastelar o gramado, diminui o tempo total de limpeza;",
            "Função moer, permite cortar a grama em pequenos pedaços que facilitam a decomposição;",
            "Sem a necessidade de trocar o óleo a cada 25h ou a cada 6 meses, onerando o usuário;",
            "Sem restrição de inclinação do terreno;",
            "Não necessita manuseio e/ou armazenamento de combustíveis e óleos;",
            "Menos paradas para manutenções;",
            "Mais silencioso."
        ],
        999,
        45,
        33.33
    ],
    [
        "RMA 510",
        "Tramontina CC 55M",
        "CC 55M",
        "Tramontina",
        "Não",
        "50",
        "24 - 62",
        "4",
        "Individual",
        1,
        "Não",
        "Sim",
        "Não",
        "-",
        "15º",
        1,
        "Powermore",
        [
            "7 posições de regulagem de corte (75% a mais), possibilita mais opções de trabalho;",
            "Ajuste da altura de corte em uma única alavanca: mais fácil e prático, com o passar do tempo fica difícil ajustar a altura individual nas rodas, o que faz com que o usuário não o faça;",
            "Cesto recolhedor com 75 litros, ao final do corte do gramado não necessita rastelar o gramado, diminui o tempo total de limpeza;",
            "Função moer, permite cortar a grama em pequenos pedaços que facilitam a decomposição;",
            "Sem a necessidade de trocar o óleo a cada 25h ou a cada 6 meses, onerando o usuário;",
            "Sem restrição de inclinação do terreno;",
            "Não necessita manuseio e/ou armazenamento de combustíveis e óleos;",
            "Menos paradas para manutenções, a cada 50h é recomendado limpar tanque e carburador, ocasionando gastos e indisponibilidade da máquina;",
            "Mais silencioso."
        ],
        1422,
        60,
        66.67
    ],
    [
        "RMA 510V",
        "Tramontina CC 55TM",
        "CC 55TM",
        "Tramontina",
        "Sim",
        "53",
        "26 - 84",
        "6",
        "Individual",
        1,
        "52",
        "Sim",
        "Não",
        "-",
        "15º",
        1,
        "Powermore",
        [
            "8 posições de regulagem de corte (33% a mais), possibilita mais opções de trabalho;",
            "Ajuste da altura de corte em uma única alavanca: mais fácil e prático, com o passar do tempo fica difícil ajustar a altura individual nas rodas, o que faz com que o usuário não o faça;",
            "Cesto recolhedor com 75 litros (44% mais capacidade), significa menos paradas para descarregar o cesto, maior produtividade;",
            "Função moer, permite cortar a grama em pequenos pedaços que facilitam a decomposição;",
            "Sem a necessidade de trocar o óleo a cada 25h ou a cada 6 meses, onerando o usuário;",
            "Sem restrição de inclinação do terreno;",
            "Não necessita manuseio e/ou armazenamento de combustíveis e óleos;",
            "Menos paradas para manutenções, a cada 50h é recomendado limpar tanque e carburador, ocasionando gastos e indisponibilidade da máquina;",
            "Mais silencioso."
        ],
        1422,
        60,
        66.67
    ],
    [
        "",
        "RMA 460",
        "RMA 460",
        "Stihl",
        "Não",
        "46",
        "35 - 90",
        "7",
        "Central",
        "-",
        "60",
        "Sim",
        "Sim",
        "700",
        "Sem restrição de uso",
        "2 cargas (AK 30)",
        "Globe EC-Motor",
        [
            ""
        ],
        1949,
        "",
        0
    ],
    [
        "",
        "RMA 510",
        "RMA 510",
        "Stihl",
        "Não",
        "51",
        "35 - 90",
        "7",
        "Central",
        "-",
        "75",
        "Sim",
        "Sim",
        "1000",
        "Sem restrição de uso",
        "2.4 cargas (AP 300)",
        "Globe EC-Motor",
        [
            ""
        ],
        2059,
        "",
        0
    ],
    [
        "",
        "RMA 460V",
        "RMA 460V",
        "Stihl",
        "Sim",
        "46",
        "25 - 100",
        "8",
        "Central",
        "-",
        "60",
        "Sim",
        "Sim",
        "875",
        "Sem restrição de uso",
        "2.5 cargas (AK 30)",
        "Globe EC-Motor",
        [
            ""
        ],
        2919,
        "",
        0
    ],
    [
        "",
        "RMA 510V",
        "RMA 510V",
        "Stihl",
        "Sim",
        "51",
        "25 - 100",
        "8",
        "Central",
        "-",
        "75",
        "Sim",
        "Sim",
        "1300",
        "Sem restrição de uso",
        "3.5 cargas (AP 300)",
        "Globe EC-Motor",
        [
            ""
        ],
        3029,
        "",
        0
    ]
];
