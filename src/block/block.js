console.log('asd')
const { blockEditor, blocks, components, element } = wp;
const { RichText, MediaUpload, PlainText } = blockEditor;
const { registerBlockType } = blocks;
const { Button } = components;

registerBlockType('card-block/main', {
    title: 'Card',
    icon: 'heart',
    category: 'common',
    attributes: {
        title: {
            source: 'text',
            selector: '.card__title'
        },
        body: {
            type: 'array',
            source: 'children',
            selector: '.card__body'
        },
        imageAlt: {
            attribute: 'alt',
            selector: '.card__image'
        },
        imageUrl: {
            attribute: 'src',
            selector: '.card__image'
        }
    },
    edit({ attributes, className, setAttributes }) {

        const getImageButton = (openEvent) => {
            if (attributes.imageUrl) {
                return (
                    <div>
                        <img
                            src={attributes.imageUrl}
                            alt={attributes.imageAlt}
                            onClick={openEvent}
                            className="image px-4"
                            role="presentation"
                        />
                        <button onClick={() => setAttributes({ imageUrl: '' })}>dele</button>
                    </div>)
                    ;
            } else {
                return (
                    <div className="button-container">
                        <Button
                            onClick={openEvent}
                            className="button button-large"
                        >
                            Pick an image
            </Button>
                    </div>
                );
            }
        };

        return (
            <div className="container">
                <MediaUpload
                    onSelect={media => setAttributes({ imageAlt: media.alt, imageUrl: media.url })}
                    type="image"
                    value={attributes.imageID}
                    render={({ open }) => getImageButton(open)}
                />
                <PlainText
                    onChange={content => setAttributes({ title: content })}
                    value={attributes.title}
                    placeholder="Your card title"
                    className="heading"
                />
                <RichText
                    onChange={content => setAttributes({ body: content })}
                    value={attributes.body}
                    multiline="p"
                    placeholder="Your card text"
                    formattingControls={['bold', 'italic', 'underline']}
                    isSelected={attributes.isSelected}
                />
            </div>
        );

    },

    save({ attributes }) {

        const cardImage = (src, alt) => {
            if (!src) {
                return null;
            }

            if (alt) {
                return (
                    <img
                        className="card__image"
                        src={src}
                        alt={alt}
                    />
                );
            }

            // No alt set, so let's hide it from screen readers
            return (
                <img
                    className="card__image"
                    src={src}
                    alt=""
                    aria-hidden="true"
                />
            );
        };

        return (
            <div className="card">
                { cardImage(attributes.imageUrl, attributes.imageAlt)}
                <div className="card__content">
                    <h3 className="card__title">{attributes.title}</h3>
                    <div className="card__body">
                        {attributes.body}
                    </div>
                </div>
            </div>
        );
    }
});