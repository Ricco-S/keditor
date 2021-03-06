export default function () {
    let self = this;
    let element = self.element;
    let id = self.id;
    
    let content = self.getContent(false);
    
    if (self.options.iframeMode) {
        self.iframeWrapper.remove();
    } else {
        self.contentAreasWrapper.remove();
    }
    
    if (element.is('textarea')) {
        element.val(content);
    } else {
        element.html(content);
    }
    
    element.removeClass('keditor-hidden-element');
    element.data('keditor', null);
    delete KEditor.instances[id];
};
