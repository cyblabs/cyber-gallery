pragma solidity ^0.4.19;

import "zeppelin-solidity/contracts/lifecycle/Destructible.sol";
import "zeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";
import "zeppelin-solidity/contracts/math/SafeMath.sol";
import "zeppelin-solidity/contracts/AddressUtils.sol";
import "zeppelin-solidity/contracts/lifecycle/Pausable.sol";
import "./IPFSeable.sol";


contract Gallery is ERC721Token, IPFSeable, Pausable, Destructible{

    using SafeMath for uint256;
    using AddressUtils for address;

    string internal linkToScene_;
    string internal artistName_;
    string internal galleryDescription_;

    struct Picture {
        string pictureName;
        string pictureDescription;
        string pictureCID;
        uint price;
        uint timestamp;
    }

    Picture[] internal pictures;

    event PictureAdded(string name, string CID, uint pictureID);
    event PictureSelled(uint256 pictureID);

    function Gallery(
        string _galleryName,
        string _gallerySymbol,
        string _artistName,
        string _galleryDescription,
        string _linkToScene
    )
        ERC721Token(_galleryName, _gallerySymbol)
        public
        payable
    {
        linkToScene_ = _linkToScene;
        artistName_ = _artistName;
        galleryDescription_ = _galleryDescription;
    }

    function getArtistName()
        public
        view
        returns(string)
    {
        return artistName_;
    }

    function getGalleryDescription()
        public
        view
        returns(string)
    {
        return galleryDescription_;
    }

    function getSceneLink()
        public
        view
        returns(string)
    {
        return linkToScene_;
    }

    function updateSceneLink(string _newScene)
        external
        onlyOwner
    {
        linkToScene_ = _newScene;
    }

    function addPicture(string _pictureName, string _pictureDescription, string _pictureCID, uint _price)
        external
        onlyOwner
    {
        Picture memory picture = (Picture(
        {
            pictureName: _pictureName,
            pictureDescription: _pictureDescription,
            pictureCID: _pictureCID,
            price: _price,
            timestamp: block.timestamp
        }));
        uint256 pictureID = pictures.push(picture) - 1;
        _mint(msg.sender, pictureID);
        PictureAdded(_pictureName, _pictureCID, pictureID);
    }

    function buyPicture(uint _pictureID)
        external
        payable
    {
        require(msg.value == pictures[_pictureID].price);
        super.removeTokenFrom(owner, _pictureID);
        super.addTokenTo(msg.sender, _pictureID);
        owner.transfer(msg.value);

        PictureSelled(_pictureID);
    }

    function getPicture(uint _pictureID)
        public
        view
        returns (string, string, string, uint, uint)
    {
        return(
            pictures[_pictureID].pictureName,
            pictures[_pictureID].pictureDescription,
            pictures[_pictureID].pictureCID,
            pictures[_pictureID].price,
            pictures[_pictureID].timestamp
        );
    }
}
