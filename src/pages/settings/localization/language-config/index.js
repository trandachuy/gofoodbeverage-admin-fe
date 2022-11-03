import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import LanguageConfig from './language-config.page'
import languageDataService from 'data-services/language/language-data.service'

const mapDispatchToProps = () => {
    return {
        languageDataService: languageDataService
    };
};

export default compose(
    withTranslation("translations"),
    connect(null, mapDispatchToProps),
    withRouter
)(LanguageConfig)