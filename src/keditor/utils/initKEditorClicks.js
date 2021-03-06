import log from '../utils/log';

export default function () {
    log('initKEditorClicks');
    
    let self = this;
    let options = self.options;
    let body = self.body;
    
    body.on('click', function (e) {
        let sidebar = self.getClickedElement(e, '.keditor-sidebar');
        let modal = self.getClickedElement(e, '.keditor-modal');
        
        let container = self.getClickedElement(e, '.keditor-container');
        if (container) {
            if (!container.hasClass('showed-keditor-toolbar')) {
                body.find('.keditor-container.showed-keditor-toolbar').removeClass('showed-keditor-toolbar');
                body.find('.keditor-component.showed-keditor-toolbar').removeClass('showed-keditor-toolbar');
                container.addClass('showed-keditor-toolbar');
                
                let contentArea = container.parent();
                if (typeof options.onContainerSelected === 'function') {
                    options.onContainerSelected.call(self, e, container, contentArea);
                }
            }
        } else {
            if (!sidebar && !modal) {
                body.find('.keditor-container.showed-keditor-toolbar').removeClass('showed-keditor-toolbar');
                body.find('.keditor-component.showed-keditor-toolbar').removeClass('showed-keditor-toolbar');
            }
        }
        
        let component = self.getClickedElement(e, '.keditor-component');
        if (component) {
            if (!component.hasClass('showed-keditor-toolbar')) {
                body.find('.keditor-component.showed-keditor-toolbar').removeClass('showed-keditor-toolbar');
                component.addClass('showed-keditor-toolbar');
                
                let contentArea = component.parent();
                if (typeof options.onComponentSelected === 'function') {
                    options.onComponentSelected.call(self, e, component, contentArea);
                }
            }
        } else {
            if (!sidebar) {
                body.find('.keditor-component.showed-keditor-toolbar').removeClass('showed-keditor-toolbar');
            }
        }
    });
    
    body.on('click', '.btn-container-setting', function (e) {
        e.preventDefault();
        
        let btn = $(this);
        log('Click on .btn-container-setting', btn);
        
        let container = btn.closest('.keditor-container');
        if (body.hasClass('opened-keditor-setting') && body.hasClass('opened-keditor-sidebar')) {
            if (!container.is(self.settingContainer)) {
                self.openSidebar(container);
            } else {
                self.closeSidebar();
            }
        } else {
            self.openSidebar(container);
        }
    });
    
    body.on('click', '.btn-container-duplicate', function (e) {
        e.preventDefault();
        
        let btn = $(this);
        log('Click on .btn-container-duplicate', btn);
        
        let container = btn.closest('.keditor-container');
        let contentArea = container.parent();
        let newContainer = $(self.getContainerContent(container, btn.parent().hasClass('keditor-toolbar-sub-container')));
        container.after(newContainer);
        self.convertToContainer(contentArea, newContainer);
        
        log('Container is duplicated');
        
        if (typeof options.onContainerDuplicated === 'function') {
            options.onContainerDuplicated.call(self, container, newContainer, contentArea);
        }
        
        if (typeof options.onContentChanged === 'function') {
            options.onContentChanged.call(self, e, contentArea);
        }
    });
    
    body.on('click', '.btn-container-delete', function (e) {
        e.preventDefault();
        
        let btn = $(this);
        log('Click on .btn-container-delete', btn);
        
        if (confirm(options.confirmDeleteContainerText)) {
            let container = btn.closest('.keditor-container');
            let components = container.find('.keditor-component');
            let contentArea = container.parent();
            
            if (typeof options.onBeforeContainerDeleted === 'function') {
                options.onBeforeContainerDeleted.call(self, e, container, contentArea);
            }
            
            let settingComponent = self.settingComponent;
            if (settingComponent) {
                let settingComponentParent = settingComponent.closest('.keditor-container');
                if (settingComponentParent.is(container)) {
                    log('Deleting container is container of setting container. Close setting panel for this setting component', settingComponent);
                    self.closeSidebar();
                }
            } else if (container.is(self.settingContainer)) {
                log('Deleting container is setting container. Close setting panel for this container', container);
                self.closeSidebar();
            }
            
            if (components.length > 0) {
                components.each(function () {
                    self.deleteComponent($(this));
                });
            }
            
            container.remove();
            
            if (typeof options.onContainerDeleted === 'function') {
                options.onContainerDeleted.call(self, e, container, contentArea);
            }
            
            if (typeof options.onContentChanged === 'function') {
                options.onContentChanged.call(self, e, contentArea);
            }
        }
    });
    
    body.on('click', '.btn-component-setting', function (e) {
        e.preventDefault();
        
        let btn = $(this);
        log('Click on .btn-component-setting', btn);
        
        let component = btn.closest('.keditor-component');
        if (body.hasClass('opened-keditor-setting') && body.hasClass('opened-keditor-sidebar')) {
            if (!component.is(self.settingComponent())) {
                self.openSidebar(component);
            } else {
                self.closeSidebar();
            }
        } else {
            self.openSidebar(component);
        }
    });
    
    body.on('click', '.btn-component-duplicate', function (e) {
        e.preventDefault();
        
        let btn = $(this);
        log('Click on .btn-component-duplicate', btn);
        
        let component = btn.closest('.keditor-component');
        let container = component.closest('.keditor-container');
        let contentArea = container.parent();
        let newComponent = $(self.getComponentContent(component));
        
        component.after(newComponent);
        self.convertToComponent(contentArea, container, newComponent);
        
        log('Component is duplicated');
        
        if (typeof options.onComponentDuplicated === 'function') {
            options.onComponentDuplicated.call(self, component, newComponent, contentArea);
        }
        
        if (typeof options.onContainerChanged === 'function') {
            options.onContainerChanged.call(self, e, container, contentArea);
        }
        
        if (typeof options.onContentChanged === 'function') {
            options.onContentChanged.call(self, e, contentArea);
        }
    });
    
    body.on('click', '.btn-component-delete', function (e) {
        e.preventDefault();
        
        let btn = $(this);
        log('Click on .btn-component-delete', btn);
        
        if (confirm(options.confirmDeleteComponentText)) {
            let component = btn.closest('.keditor-component');
            let container = component.closest('.keditor-container');
            let contentArea = component.closest('.keditor-content-area');
            
            if (typeof options.onBeforeComponentDeleted === 'function') {
                options.onBeforeComponentDeleted.call(self, e, component, contentArea);
            }
            
            if (component.is(self.settingComponent)) {
                self.closeSidebar();
            }
            
            self.deleteComponent(component);
            
            if (typeof options.onComponentDeleted === 'function') {
                options.onComponentDeleted.call(self, e, component, contentArea);
            }
            
            if (typeof options.onContainerChanged === 'function') {
                options.onContainerChanged.call(self, e, container, contentArea);
            }
            
            if (typeof options.onContentChanged === 'function') {
                options.onContentChanged.call(self, e, contentArea);
            }
        }
    });
    
    body.addClass('keditor-clicks-initialized');
};
