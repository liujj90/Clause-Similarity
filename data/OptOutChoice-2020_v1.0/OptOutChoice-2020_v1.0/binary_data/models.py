from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.types import Enum
import enum

Base = declarative_base()


class Label(enum.Enum):
    Unlabeled = 0
    Negative = 1
    Positive = 2
    Problem = 3


class ContainedInSentence(enum.Enum):
    Unlabeled = 0
    No = 1
    Yes = 2


class Ambiguity(enum.Enum):
    Unlabeled = 0
    Low = 1
    Medium = 2
    High = 3


class Hyperlink(Base):
    __tablename__ = 'hyperlinks'
    id = Column(Integer, primary_key=True)
    url = Column(String, nullable=False)
    hyperlink_text = Column(String, nullable=False)
    full_sentence_text = Column(String, nullable=True)
    label = Column(Enum(Label), default=Label.Unlabeled)
    contained_in_sentence = Column(
        Enum(ContainedInSentence),
        default=ContainedInSentence.Unlabeled)
    ambiguity = Column(Enum(Ambiguity),
                       default=Ambiguity.Unlabeled)
    policy_id = Column(Integer, ForeignKey('policies.id'))

    policy = relationship('Policy', back_populates='hyperlinks')


class Policy(Base):
    __tablename__ = 'policies'
    id = Column(Integer, primary_key=True)
    url = Column(String, nullable=False)
    html = Column(String, nullable=True)
    unfiltered_html = Column(String, nullable=False)
    site_id = Column(Integer, ForeignKey('sites.id'))

    site = relationship('Site', back_populates='policies',
                        foreign_keys=[site_id])
    hyperlinks = relationship(
        'Hyperlink', order_by=Hyperlink.id, back_populates='policy',
        lazy='dynamic')

    included = Column(Boolean, default=False)


class SiteStatus(enum.Enum):
    NotDownloaded = 0
    Downloaded = 1
    Labeled = 2


class MlSet(enum.Enum):
    Train = 0
    Test = 1
    Validation = 2

    
class Site(Base):
    __tablename__ = 'sites'
    id = Column(Integer, primary_key=True)
    alexa_rank = Column(Integer, nullable=False)
    url = Column(String, nullable=False)

    policies = relationship(
        'Policy', order_by=Policy.id, back_populates='site',
        foreign_keys=[Policy.site_id], lazy='dynamic')

    status = Column(Enum(SiteStatus),
                    default=SiteStatus.NotDownloaded)
    ml_set = Column(Enum(MlSet),
                    default=MlSet.Train)
    
