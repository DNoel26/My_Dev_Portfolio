class Project {

    name;
    description; 
    status; // Completed, Work in Progress, On Hold
    link; // href to project hosted site
    link_header; // e.g. "Play" or "View" Now
    link_note; // e.g. (expect audio)
    github_link; // href to project github repo
    github_readme; // boolean
    notes = [];
    thumbnail = {
        
        btn_id: null,
        src: null,
        alt: null,
    }; // main image displayed in gallery
    carousel_img_list = {

        id: [],
        src: [],
        alt: [],
    };
    tool_icon_list = {

        id: [],
        src: [],
        alt: [],
    }; // i.e. to be added to the "- Built Using -" icon section

    constructor(n,s,l,lh,gl,gr)
    {
        if(gr === true) {

            gr = "(GitHub - readme available)";
        } else {

            gr = "(GitHub)";
        };
        
        this.name = n;
        this.status = s;
        this.link = l;
        this.link_header = lh;
        this.github_link = gl;
        this.github_readme = gr;
    };

    add_tool_icon(id,src,alt) {

        this.tool_icon_list.id.push(...id);
        this.tool_icon_list.src.push(...src);
        this.tool_icon_list.alt.push(...alt);
    };
};

export default Project;