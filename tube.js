let vts=[]; //黒色の頂点座標
let vts2;   //青色の頂点座標

function setup(){
    createCanvas(windowWidth,windowHeight,WEBGL);
    debugMode();
    
    for(let i=0;i<15;i++)   vts.push([2*cos(2*PI/8*i),i/2-3,2*sin(2*PI/8*i)]);  //  黒点の座標計算、螺旋
    //vts=[[-2,-2,-1],[0,0,1],[-1,2,3],[-3,1.5,4]]; //vtsの記入例
    vts2=tubecalc(vts,5,0.8);
    
}

function draw(){
    
    background(255);
    orbitControl(4,4);   
    scale(50);

    //黒点、黒線
    stroke(0);
    for(let i=0;i<vts.length;i++){
        point(vts[i][0],vts[i][1],vts[i][2]);
        if(i!=0)    line(vts[i-1][0],vts[i-1][1],vts[i-1][2],vts[i][0],vts[i][1],vts[i][2]);
    }
     
    //青点、青線
    noFill();
    stroke(100,100,255);

    let n=vts2[0].length;
    for(let i=0;i<vts.length;i++){
        for(let j=0;j<n;j++){
            point(vts2[i][j][0],vts2[i][j][1],vts2[i][j][2]);

            if(i!=vts.length-1){
                beginShape();
                vertex(vts2[i][j][0], vts2[i][j][1], vts2[i][j][2]);
                vertex(vts2[i+1][j][0], vts2[i+1][j][1], vts2[i+1][j][2]);
                vertex(vts2[i+1][(j+1)%n][0], vts2[i+1][(j+1)%n][1], vts2[i+1][(j+1)%n][2]);
                vertex(vts2[i][(j+1)%n][0], vts2[i][(j+1)%n][1], vts2[i][(j+1)%n][2]);
                endShape(CLOSE);
            }
        }
    }

    stroke(200);
    
}

//折れ線の黒色頂点座標の配列a(頂点数×3)、n角形、多角形の径rを入力して青色頂点座標の配列(黒色の頂点数×n×3)を返す
function tubecalc(a,n,r){

    let vr=p5.Vector.random3D();

    let va=createVector(); 
    let vb=createVector();
    let vab=createVector(); 
    let vbc=createVector();

    let result=new Array(a.length);
    for(let i=0;i<result.length;i++)    result[i]=[];

    let pp=[];

    va.set(a[0][0],a[0][1],a[0][2]);
    vab.set(a[1][0]-a[0][0],a[1][1]-a[0][1],a[1][2]-a[0][2]);

    let tem=p5.Vector.cross(vab,vr);    //軸に垂直な点を1つ出す
    tem.normalize().mult(r);

    for(let i=0;i<n;i++){   //軸に垂直な多角形の座標
        tem=rot(tem,vab,2*PI/n);
        result[0][i]=createVector(tem.x+va.x,tem.y+va.y,tem.z+va.z);
        pp=result[0].concat();
    }
    
    for(let k=1;k<a.length-1;k++){  //多角形を軸に沿って平行移動、折れ角で回転
        vab.set(a[k][0]-a[k-1][0],a[k][1]-a[k-1][1],a[k][2]-a[k-1][2]);
        vbc.set(a[k+1][0]-a[k][0],a[k+1][1]-a[k][1],a[k+1][2]-a[k][2]);
        vb.set(a[k][0],a[k][1],a[k][2]);

        for(let i=0;i<n;i++){
            result[k][i]=p5.Vector.add(pp[i],vab).sub(vb);
            result[k][i]=rot(result[k][i],p5.Vector.cross(vab,vbc),abs(vab.angleBetween(vbc))/2);
            pp[i]=rot(result[k][i],p5.Vector.cross(vab,vbc),abs(vab.angleBetween(vbc))/2);
            result[k][i].add(vb);
            if(k!=a.length-2)    pp[i].add(vb);
            else    result[k+1][i]=pp[i].add([a[k+1][0],a[k+1][1],a[k+1][2]]);
            
        }
    }

    for(let i=0;i<result.length;i++)    for(let j=0;j<result[i].length;j++){    //ベクトルから配列形式に変換
        result[i][j]=[result[i][j].x, result[i][j].y, result[i][j].z];
    }

    return result;
}

//位置ベクトルvを方向ベクトルnを軸としてtheta回転させた位置ベクトルを返す（ロドリゲスの回転公式）
function rot(v,n,theta){

    let temx=v.x,temy=v.y,temz=v.z;
    let x,y,z;
    n=p5.Vector.normalize(n);

    x=(n.x*n.x*(1-cos(theta))+cos(theta))*temx+(n.x*n.y*(1-cos(theta))-n.z*sin(theta))*temy+(n.x*n.z*(1-cos(theta))+n.y*sin(theta))*temz;
    y=(n.x*n.y*(1-cos(theta))+n.z*sin(theta))*temx+(n.y*n.y*(1-cos(theta))+cos(theta))*temy+(n.y*n.z*(1-cos(theta))-n.x*sin(theta))*temz;
    z=(n.x*n.z*(1-cos(theta))-n.y*sin(theta))*temx+(n.y*n.z*(1-cos(theta))+n.x*sin(theta))*temy+(n.z*n.z*(1-cos(theta))+cos(theta))*temz;

    return createVector(x,y,z); 
}