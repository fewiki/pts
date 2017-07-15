Pts.namespace( window );

var space = new CanvasSpace("#pt").setup({retina: true});
var form = space.getForm();

let gp = new Group();
let line1, line2, line3, line4;
let rect1, rect2, rect3;
let poly1;
let circle1, circle2;


space.add( {

  start: (bound, space) => {
    let ux = space.width/20;
    let uy = space.height/20;

    // vertical and horizontal line
    line1 = Group.fromArray( [[-ux, -space.height/3], [ux, space.height/3]] ); 
    line2 = Group.fromArray( [[0, -space.height/2], [0, space.height/2]] ); 
    line3 = Group.fromArray( [[-space.width/3, -uy], [space.width/3, uy]] ); 
    line4 = Group.fromArray( [[-space.width/2, 0], [space.width/2, 0]] ); 
    gp.push( line1, line2, line3, line4 );

    // bounds
    rect1 = Group.fromArray( [[-ux*3, -uy*3], [ux, uy]] ); 
    rect2 = Group.fromArray( [[-ux, -ux], [ux*4, ux*4]] ); 
    gp.push( rect1, rect2 );

    // shapes
    poly1 = Group.fromArray( [[-ux*2, -uy*2], [ux, uy*3], [ux*4, 0], [ux*6, uy*5]] ); 
    gp.push( poly1 );

    for (let i=0, len=gp.length; i<len; i++) {
      gp[i].anchorFrom( space.center );
    }

    circle1 = Circle.fromRect( rect1 );
    circle2 = Circle.fromRect( rect1, true );
    circle3 = Circle.fromRect( rect2, true );
    rect3 = Rectangle.union( [rect1, rect2] );
  },

  animate: (time, fps) => {
    form.stroke("#c1c5ca", 1).fill(false);
    form.lines( [line1, line2, line3, line4, poly1] );
    form.rects( [rect1, rect2, rect3] );
    form.circles( [circle1, circle2, circle3] );
    
    // Begin Test Code --
    
    form.stroke( false );

    let grid = 10;

    
    let d = space.pointer.$subtract( space.center );
    
    for (let i=0; i<grid; i++) {
      for (let k=0; k<grid; k++) {
        let target = "hsl";
        let h = Num.mapToRange( Geom.toDegree( Math.atan2( d.y, d.x) ), -180, 180, Color.ranges[target][0][0], Color.ranges[target][0][1] );
        let s = Num.mapToRange( k, 0, grid-1, Color.ranges[target][1][0], Color.ranges[target][1][1] );
        let l = Num.mapToRange( i, 0, grid-1, Color.ranges[target][2][0], Color.ranges[target][2][1] );
        
        let hsl = Color.hsl( h, s, l );
        let rgb = Color.HSLtoRGB( hsl );

        let sub = Rectangle.size( rect3 ).$divide( grid );
        let pos = rect3.p1.$add( sub.$multiply( i, k ) );

        form.fill( rgb.toString("hex") ).rect( Rectangle.fromTopLeft( pos, sub.$add(1) ) );

        // Check reverse convert
        target = "rgb";
        let r = Num.mapToRange( Geom.toDegree( Math.atan2( d.y, d.x) ), -180, 180, Color.ranges[target][0][0], Color.ranges[target][0][1] );
        let g = Num.mapToRange( k, 0, grid-1, Color.ranges[target][1][0], Color.ranges[target][1][1] );
        let b = Num.mapToRange( i, 0, grid-1, Color.ranges[target][2][0], Color.ranges[target][2][1] );
        
        let revRGB = Color.rgb( r, g, b );
        let revHSL = Color.RGBtoHSL( revRGB );
        let backToRGB = Color.HSLtoRGB( revHSL );

        let sub2 = Rectangle.size( rect3 ).$divide( grid );
        let pos2 = rect3.p1.$add( 0, rect3.p2.y-rect3.p1.y+20 ).add( sub.$multiply( i, k ) );

        form.fill( backToRGB.toString("hex") ).rect( Rectangle.fromTopLeft( pos2, sub2.$add(1) ) );

      }
      
    }

    // End
  },

  action:( type, px, py) => {

  },
  
  resize:( bound, evt) => {
    
  }
  
});
  
space.bindMouse();
space.play();
// space.playOnce(200);