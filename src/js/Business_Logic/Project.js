/** @format */

class Project {
    name;
    description;
    status = {
        msg: null, // Completed, Work in Progress, On Hold
        classCode: null, // For CSS style setting
    };
    //TODO Convert link and github etc to objects
    link; // href to project hosted site
    linkHeader; // e.g. "Play" or "View" Now
    linkNote; // e.g. (expect audio)
    githubLink; // href to project github repo
    githubReadme; // boolean
    notes = []; // displayed as an unordered list
    thumbnail = {
        btnId: null,
        src: null,
        alt: null,
    }; // main button image displayed in gallery above project overview
    carouselImgList = {
        ids: [],
        srcs: [],
        alts: [],
    }; // images to be displayed in the carousel
    toolIconList = {
        ids: [],
        srcs: [],
        alts: [],
    }; // i.e. to be added to the "- Built Using -" icon section

    constructor(name, _status, link, linkHeader, githubLink, githubReadme) {
        if (_status === 1) {
            _status = 'Completed';
            this.status.classCode = 'status-complete';
        } else if (_status === 2) {
            _status = 'Work in Progress';
            this.status.classCode = 'status-in-progress';
        } else if (_status === 3) {
            _status = 'On Hold';
            this.status.classCode = 'status-hold';
        }
        if (githubReadme === true) {
            githubReadme = '(GitHub - readme available)';
        } else {
            githubReadme = '(GitHub)';
        }
        this.name = name;
        this.status.msg = _status;
        this.link = link;
        this.linkHeader = linkHeader;
        this.githubLink = githubLink;
        this.githubReadme = githubReadme;
    }

    addImgs(ids, srcs, alts) {
        this.carouselImgList.ids.push(...ids);
        this.carouselImgList.srcs.push(...srcs);
        this.carouselImgList.alts.push(...alts);
    }
    addToolIcons(ids, srcs, alts) {
        this.toolIconList.ids.push(...ids);
        this.toolIconList.srcs.push(...srcs);
        this.toolIconList.alts.push(...alts);
    }
}

export default Project;
