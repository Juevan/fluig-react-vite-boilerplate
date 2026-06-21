<#assign settingsJSON = widgetSettings!'{}'>
<#attempt><#assign settings = settingsJSON?eval><#recover><#assign settings = {}></#attempt>

<div id="AppWidget_${instanceId}" class="super-widget wcm-widget-class fluig-style-guide" data-params="AppWidget.instance({mode: 'edit', successSaveMessage: '${i18n.getTranslation('widget.successSave')}', errorSaveMessage: '${i18n.getTranslation('widget.errorSave')}'})">
    <div class="panel panel-default">
        <div class="panel-heading"><h3 class="panel-title">${i18n.getTranslation('widget.editPanelTitle')}</h3></div>
        <div class="panel-body">
            <form role="form" class="fs-prevent-default">
                <div class="form-group">
                    <label>${i18n.getTranslation('widget.labelName')}</label>
                    <input type="text" class="form-control" name="userName" value="${(settings.userName)!''}" placeholder="${i18n.getTranslation('widget.placeholderName')}">
                </div>
                <button type="button" class="btn btn-primary" data-salvar-config>${i18n.getTranslation('widget.btnSave')}</button>
            </form>
        </div>
    </div>
</div>
