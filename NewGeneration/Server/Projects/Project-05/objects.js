class Ring {
    constructor(pos, radius, orbits = 1) {
        this.pos = new Vector(pos);
        this.radius = Math.max(isNaN(Number(radius)) ? 0 : radius, 0);
        this.orbits = Math.max(isNaN(Number(orbits)) ? 0 : orbits, 0);
        this.rot = 0;
    }
    show() {
        let dots = Array(Math.round(this.orbits)).fill().map((e,i) => (360/this.orbits) * i);
        for(let d of dots) {
            let pos = Vector.fromAngle(d + this.rot).mult(this.radius/2).add(this.pos);
            fill(55,110,255);
            stroke(55,110,255);
            strokeWeight(0);
            circle(...pos, this.radius/6);
            strokeWeight(this.radius/15);
            let rot = 230;
            let pos2 = pos.clone().add(Vector.fromAngle(this.rot + d - rot).mult(this.radius/2.5));
            line(...pos, ...pos2);
            line(
                ...pos2.clone().sub(Vector.fromAngle(this.rot + d - rot).mult(this.radius/40)),
                ...pos2.clone().add(Vector.fromAngle(this.rot + d - (90+rot)).mult(this.radius/20)).sub(Vector.fromAngle(this.rot + d - (rot - 15)).mult(this.radius/40))
            );
            line(
                ...pos2.clone().sub(Vector.fromAngle(this.rot + d - rot).mult(this.radius/9)),
                ...pos2.clone().add(Vector.fromAngle(this.rot + d - (90+rot)).mult(this.radius/30)).sub(Vector.fromAngle(this.rot + d - (rot - 15)).mult(this.radius/9))
            );
        }
        noStroke();
        fill(255,55,55);
        circle(...this.pos, this.radius/2);
        fill(255);
        circle(...this.pos.clone().sub(0, this.radius/20), this.radius/6);
        stroke(255);
        line(...this.pos.clone().sub(0, this.radius/10), ...this.pos.clone().add(0,this.radius/10));
    }
    update(i) {
        this.rot += i;
        this.rot = this.rot % 360;
    }
}