import React from 'react';
import PropTypes from 'prop-types';

// Components
import ContactUsCTA from '../ContactUsCTA';

// Styles
import bulma from 'styles/bulma.scss';
import styles from './styles.scss';

const EnrichmentTemplate = ({ data }) => {
  // Generate the divs for the 4 different Enrichment examples
  const enrichmentExamples = data.section2 && Object.keys(data.section2)
    .sort() // Since the keys come out in an indeterminate order... #object-things
    .map((content) => <div key={content} dangerouslySetInnerHTML={{ __html: data.section2[content].html }} />);

  const boldHero = `${bulma.hero} ${bulma['is-bold']}`;
  const mainHero = `${boldHero} ${bulma['is-small']} ${bulma['is-primary']}`;
  const infoHero = `${boldHero} ${bulma['is-medium']} ${bulma['is-info']}`;
  const lightHero = `${boldHero} ${bulma['is-medium']} ${bulma['is-light']}`;

  const mediumCustomContent = `${bulma.content} ${bulma['is-medium']} ${styles.content}`;

  return (
    <div>
      <section className={mainHero}>
        <div className={bulma['hero-body']}>
          <div className={bulma.container}>
            <h1 className={`${bulma.title} ${styles.mainTitle}`}>
              {data.title}
            </h1>
          </div>
        </div>
      </section>
      <section className={lightHero}>
        <div className={bulma['hero-body']}>
          <div className={bulma.container}>
            <div className={mediumCustomContent} dangerouslySetInnerHTML={{ __html: data.section1.html }} />
          </div>
        </div>
      </section>
      <section className={infoHero}>
        <div className={bulma['hero-body']}>
          <div className={bulma.container}>
            <div className={`${bulma.content} ${bulma['is-medium']} ${styles.content} ${styles.columnCluster}`}>
              {enrichmentExamples}
            </div>
          </div>
        </div>
      </section>
      <ContactUsCTA />
    </div>
  );
};

EnrichmentTemplate.propTypes = {
  data: PropTypes.object.isRequired,
};

export default EnrichmentTemplate;
